import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for sending email alerts
  app.post("/api/send-alert", async (req, res) => {
    try {
      const { type, data } = req.body;
      const adminEmail = process.env.ADMIN_EMAIL || "tanachiddo@gmail.com";
      const resendApiKey = process.env.RESEND_API_KEY;

      if (!resendApiKey) {
        console.warn("RESEND_API_KEY is missing. Skipping email.");
        return res.status(200).json({ status: "skipped", message: "API key missing" });
      }

      const resend = new Resend(resendApiKey);

      let subject = "";
      let html = "";

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
          <p><a href="https://${req.get('host')}/admin">View in Admin Portal</a></p>
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
          <p><a href="https://${req.get('host')}/admin">View in Admin Portal</a></p>
        `;
      }

      const info = await resend.emails.send({
        from: "Lalokhumed Alerts <onboarding@resend.dev>",
        to: adminEmail,
        subject: subject,
        html: html,
      });

      res.json({ success: true, info });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
