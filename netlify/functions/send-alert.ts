import { Handler } from "@netlify/functions";
import { Resend } from "resend";

const handler: Handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL || "tanachiddo@gmail.com";

    if (!resendApiKey) {
      console.error("RESEND_API_KEY environment variable is missing.");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Server Configuration Error: API Key missing" }),
      };
    }

    console.log(`Resend configuration: Using onboarding@resend.dev. Ensure ${adminEmail} is the email address used to sign up for Resend.`);
    
    const resend = new Resend(resendApiKey);

  try {
    const { type, data } = JSON.parse(event.body || "{}");

    if (!type || !data) {
      return { statusCode: 400, body: "Bad Request: Missing type or data" };
    }

    let subject = "";
    let html = "";

    const host = event.headers.host || "lalokhumed.co.za";

    if (type === "booking") {
      subject = `New Booking: ${data.fullName}`;
      html = `
        <h1>New Booking Notification</h1>
        <p><strong>Name:</strong> ${data.fullName}</p>
        <p><strong>Service:</strong> ${data.service}</p>
        <p><strong>Date:</strong> ${data.preferredDate}</p>
        <p><strong>Time:</strong> ${data.preferredTime}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <br/>
        <p><a href="https://${host}/admin">View in Admin Portal</a></p>
      `;
    } else if (type === "questionnaire") {
      subject = `New Questionnaire: ${data.fullName} (${data.formCategory})`;
      html = `
        <h1>New Questionnaire Submission</h1>
        <p><strong>Name:</strong> ${data.fullName}</p>
        <p><strong>Form Type:</strong> ${data.formCategory}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <br/>
        <p>Check the admin portal for full details.</p>
        <p><a href="https://${host}/admin">View in Admin Portal</a></p>
      `;
    }

    console.log(`Email details: Type=${type}, To=${adminEmail}`);
    
    const { data: resendData, error: resendError } = await resend.emails.send({
      from: "Lalokhumed Alerts <onboarding@resend.dev>",
      to: adminEmail,
      subject: subject,
      html: html,
    });

    if (resendError) {
      console.error("Resend API Error:", resendError);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: resendError.message, details: resendError }),
      };
    }

    console.log("Email sent successfully:", resendData);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, id: resendData?.id }),
    };
  } catch (error) {
    console.error("Function Execution Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error", message: error instanceof Error ? error.message : String(error) }),
    };
  }
};

export { handler };
