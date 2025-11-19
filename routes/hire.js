// routes/hire.js
import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("📩 Hire request received:", req.body);

  const {
    businessName,
    ownerName,
    phone,
    email,
    city,
    state,
    techniciansNeeded,
    experienceLevel,
    startDate,
    message = "",
  } = req.body;

  if (!businessName || !ownerName || !phone || !email) {
    return res.status(400).json({ error: "Required fields missing" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // smtp.gmail.com or smtpout.secureserver.net
      port: Number(process.env.EMAIL_PORT), // 587 or 465
      secure: process.env.EMAIL_PORT === "465",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password or GoDaddy password
      },
    });

    const htmlTemplate = `
      <div style="margin:0; padding:20px; background:#f5f5f5; font-family:Arial, sans-serif;">
        <div style="max-width:650px; margin:auto; background:white; padding:25px; border-radius:12px; box-shadow:0 8px 25px rgba(0,0,0,0.1);">

          <h2 style="color:#F37021; text-align:center; margin-bottom:10px;">
            🛠 New Hiring Request
          </h2>

          <p style="font-size:15px;">A business has submitted a request to hire technicians.</p>
          <hr style="margin:20px 0;">

          <h3 style="color:#333;">Business Details</h3>
          <p><strong>Business Name:</strong> ${businessName}</p>
          <p><strong>Owner Name:</strong> ${ownerName}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Location:</strong> ${city}, ${state}</p>

          <h3 style="margin-top:25px; color:#333;">Hiring Info</h3>
          <p><strong>Technicians Needed:</strong> ${techniciansNeeded}</p>
          <p><strong>Experience Level:</strong> ${experienceLevel}</p>
          <p><strong>Start Date:</strong> ${startDate}</p>

          ${
            message
              ? `<p style="margin-top:20px;"><strong>Additional Message:</strong><br>${message.replace(
                  /\n/g,
                  "<br>"
                )}</p>`
              : ""
          }

          <div style="margin-top:25px; background:#FFF3E6; padding:15px; border-left:5px solid #F37021; border-radius:6px;">
            <strong>⚠ Action Required:</strong> Please contact the client within 24 hours.
          </div>

        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"GetFix Academy" <${process.env.EMAIL_USER}>`,
      to: "info@getfixacademy.com",
      replyTo: email,
      subject: `Hiring Request - ${businessName} (${techniciansNeeded} Technicians)`,
      html: htmlTemplate,
    });

    console.log("✅ Hire email sent successfully!");
    return res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    return res.status(500).json({ error: "Failed to send email" });
  }
});

export default router;
