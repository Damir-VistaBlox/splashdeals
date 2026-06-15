import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465, // true for port 465, false for others
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export type EmailAttachment = {
  filename: string;
  content: string | Buffer;
  encoding?: string;
  cid?: string;
};

export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: EmailAttachment[];
};

/**
 * 📧 Splashdeals Email Service
 * Uses Nodemailer with SMTP transport.
 */
export async function sendEmail({ to, subject, html, text, attachments }: EmailPayload): Promise<void> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("[Email] SMTP not configured. Skipping email send.");
    console.warn("[Email] Required: SMTP_USER, SMTP_PASS. Optional: SMTP_HOST, SMTP_PORT, SMTP_FROM.");
    
    // In dev, we might want to log the content if SMTP is missing
    if (process.env.NODE_ENV === "development") {
      console.log("--- DEVELOPMENT EMAIL LOG ---");
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Content: ${text || "HTML provided"}`);
      if (attachments && attachments.length > 0) {
        console.log(`Attachments: ${attachments.map(a => `${a.filename} (CID: ${a.cid})`).join(", ")}`);
      }
      console.log("----------------------------");
    }
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "Splashdeals <noreply@splashdeals.rs>",
      to,
      subject,
      html,
      text: text || undefined,
      attachments: attachments || [],
    });
    console.log(`[Email] ✅ Sent "${subject}" to ${to}`);
  } catch (error) {
    console.error(`[Email] ❌ Failed to send "${subject}" to ${to}:`, error);
    // We re-throw so the caller (Better-Auth) knows it failed
    throw error;
  }
}
