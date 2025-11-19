import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import winston from 'winston';

dotenv.config();

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint()
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  try {
    // GoDaddy SMTP Transporter
    const transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net",  // REQUIRED for GoDaddy
      port: 465,                         // ALWAYS use 465 for SSL
      secure: true,                      // SSL true
      auth: {
        user: process.env.EMAIL_USER,    // full email: info@yourdomain.com
        pass: process.env.EMAIL_PASS,    // normal email password
      },
    });

    const mailOptions = {
      from: `"GetFix Academy" <${process.env.EMAIL_USER}>`,
      to: "info@getfixacademy.com",  // receiving email
      replyTo: email,
      subject: `📩 New Contact Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 30px;">
          <div style="max-width: 600px; background: #ffffff; margin: auto; border-radius: 10px; 
                      box-shadow: 0 4px 10px rgba(0,0,0,0.1); padding: 25px;">
            <h2 style="color: #1a73e8; text-align: center; margin-bottom: 20px;">
              📬 New Contact Form Submission
            </h2>
            <p style="font-size: 16px; color: #333;">
              Hello Admin, you received a new message from your website contact form.
            </p>
            <div style="margin-top: 20px;">
              <p style="font-size: 15px;"><strong>Name:</strong> ${name}</p>
              <p style="font-size: 15px;"><strong>Email:</strong> ${email}</p>
            </div>
            <div style="margin-top: 20px; padding: 15px; background: #f1f5fb; 
                        border-left: 4px solid #1a73e8; border-radius: 6px;">
              <p style="font-size: 15px; white-space: pre-line;">${message}</p>
            </div>
            <p style="font-size: 14px; color: #777; margin-top: 25px; text-align: center;">
              This message was sent via the GetFix Academy Contact Form.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Message sent successfully!' });

  } catch (error) {
    logger.error('Nodemailer Error:', error);
    return res.status(500).json({ error: 'Failed to send email.' });
  }
});

export default router;
