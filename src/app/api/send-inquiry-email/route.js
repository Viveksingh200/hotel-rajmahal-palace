import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { HOTEL_INFO } from "@/data/hotel";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    console.log(`[INQUIRY DISPATCH] Processing inquiry from ${name} (${email})...`);

    const emailjsServiceId = process.env.EMAILJS_SERVICE_ID || process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const emailjsTemplateId =
      process.env.EMAILJS_INQUIRY_TEMPLATE_ID ||
      process.env.NEXT_PUBLIC_EMAILJS_INQUIRY_TEMPLATE_ID ||
      "template_af9k2wd";
    const emailjsPublicKey = process.env.EMAILJS_PUBLIC_KEY || process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    const recipientEmail = HOTEL_INFO.email || "rajmahalpalace03@gmail.com";

    let emailSent = false;

    // 1. Send via EmailJS REST API
    if (emailjsServiceId && emailjsTemplateId && emailjsPublicKey) {
      try {
        const emailjsRes = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Origin": process.env.NEXT_PUBLIC_SITE_URL || "https://hotelrajmahalpalace.in",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          },
          body: JSON.stringify({
            service_id: emailjsServiceId,
            template_id: emailjsTemplateId,
            user_id: emailjsPublicKey,
            template_params: {
              // Recipient & Sender identifiers
              to_name: "Palace Concierge Desk",
              to_email: recipientEmail,
              from_name: name,
              from_email: email,
              reply_to: email,
              // Alternative parameter aliases
              name: name,
              customer_name: name,
              email: email,
              customer_email: email,
              phone: phone || "Not Provided",
              phone_number: phone || "Not Provided",
              customer_phone: phone || "Not Provided",
              // The inquiry content
              message: message,
              inquiry_message: message,
              subject: `New Guest Inquiry from ${name}`,
            },
          }),
        });

        if (emailjsRes.ok) {
          console.log(`[INQUIRY DISPATCH] Inquiry email delivered via EmailJS!`);
          emailSent = true;
        } else {
          const errText = await emailjsRes.text();
          console.warn("[INQUIRY DISPATCH] EmailJS send warning:", errText);
        }
      } catch (emailjsErr) {
        console.warn("[INQUIRY DISPATCH] EmailJS send error:", emailjsErr);
      }
    }

    // 2. Fallback via SMTP if configured
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!emailSent && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const htmlContent = `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #c5a059; border-radius: 8px;">
          <h2 style="color: #c5a059; text-align: center;">New Guest Inquiry</h2>
          <hr style="border: 0; border-top: 1px solid #e0d0b0;" />
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "N/A"}</p>
          <div style="background: #faf7f2; padding: 15px; border-left: 3px solid #c5a059; margin-top: 15px;">
            <strong>Message:</strong><br />
            ${message.replace(/\n/g, "<br />")}
          </div>
          <p style="font-size: 11px; color: #888; margin-top: 20px;">Received via Hotel Rajmahal Palace Contact Form</p>
        </div>
      `;

      await transporter.sendMail({
        from: `"Rajmahal Inquiries" <${smtpUser}>`,
        to: recipientEmail,
        replyTo: email,
        subject: `New Inquiry from ${name} [Hotel Rajmahal Palace]`,
        html: htmlContent,
      });

      console.log(`[INQUIRY DISPATCH] Inquiry email delivered via SMTP!`);
      emailSent = true;
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry received and email dispatched successfully",
    });
  } catch (err) {
    console.error("[INQUIRY ERROR]", err);
    return NextResponse.json(
      { error: "Failed to dispatch inquiry email", details: err.message },
      { status: 500 }
    );
  }
}
