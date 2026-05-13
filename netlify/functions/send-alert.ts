import { Handler } from "@netlify/functions";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const handler: Handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { type, data } = JSON.parse(event.body || "{}");
    const adminEmail = process.env.ADMIN_EMAIL || "tanachiddo@gmail.com";

    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY is missing. Skipping email.");
      return {
        statusCode: 200,
        body: JSON.stringify({ status: "skipped", message: "API key missing" }),
      };
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

    const info = await resend.emails.send({
      from: "Lalokhumed Alerts <notifications@resend.dev>",
      to: adminEmail,
      subject: subject,
      html: html,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, info }),
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send email" }),
    };
  }
};

export { handler };
