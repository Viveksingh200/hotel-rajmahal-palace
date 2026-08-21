import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      bookingReference,
      customerName,
      customerEmail,
      customerPhone,
      roomName,
      checkIn,
      checkOut,
      nights,
      totalAmount,
      razorpayPaymentId,
      razorpayOrderId,
    } = body;

    if (!customerEmail || !bookingReference) {
      return NextResponse.json(
        { error: "Missing required fields for confirmation email" },
        { status: 400 }
      );
    }

    console.log(`[EMAIL DISPATCH] Preparing confirmation email for ${customerEmail} (Ref: ${bookingReference})...`);

    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Georgia', serif; background-color: #faf7f2; color: #1a1d24; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #c5a059; border-radius: 8px; overflow: hidden; }
        .header { background-color: #12100e; color: #faf7f2; padding: 30px 20px; text-align: center; border-b: 2px solid #c5a059; }
        .header h1 { font-size: 24px; margin: 0; color: #c5a059; letter-spacing: 2px; }
        .header p { margin: 5px 0 0 0; font-size: 12px; letter-spacing: 3px; color: #faf7f2; text-transform: uppercase; }
        .content { padding: 30px 20px; }
        .status-badge { background-color: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 8px 16px; border-radius: 4px; display: inline-block; font-family: monospace; font-size: 12px; font-weight: bold; margin-bottom: 20px; }
        .ref-box { background: #12100e; color: #c5a059; padding: 15px; border-radius: 6px; text-align: center; font-family: monospace; font-size: 18px; font-weight: bold; margin-bottom: 25px; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
        .table td { padding: 12px; border-bottom: 1px solid #eae2d5; font-size: 14px; }
        .table td.label { color: #5a3d28; font-weight: bold; width: 40%; }
        .total-row { background: #faf7f2; font-weight: bold; font-size: 16px; }
        .footer { background-color: #faf7f2; padding: 20px; text-align: center; font-size: 12px; color: #5a3d28; border-top: 1px solid #eae2d5; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <p>Official Reservation Voucher</p>
          <h1>HOTEL RAJMAHAL PALACE</h1>
        </div>
        <div class="content">
          <div style="text-align: center;">
            <div class="status-badge">✓ PAYMENT VERIFIED & BOOKING CONFIRMED</div>
          </div>

          <p>Namaste <strong>${customerName}</strong>,</p>
          <p>We are delighted to confirm your upcoming luxury stay at Hotel Rajmahal Palace. Below are your official booking details:</p>

          <div class="ref-box">
            BOOKING REF: ${bookingReference}
          </div>

          <table class="table">
            <tr>
              <td class="label">Guest Name:</td>
              <td>${customerName}</td>
            </tr>
            <tr>
              <td class="label">Contact Email:</td>
              <td>${customerEmail}</td>
            </tr>
            <tr>
              <td class="label">Phone Number:</td>
              <td>${customerPhone}</td>
            </tr>
            <tr>
              <td class="label">Suite Reserved:</td>
              <td><strong>${roomName}</strong></td>
            </tr>
            <tr>
              <td class="label">Check-In Date:</td>
              <td>${checkIn} (From 2:00 PM)</td>
            </tr>
            <tr>
              <td class="label">Check-Out Date:</td>
              <td>${checkOut} (Until 11:00 AM)</td>
            </tr>
            <tr>
              <td class="label">Duration:</td>
              <td>${nights} Night(s)</td>
            </tr>
            <tr>
              <td class="label">Payment ID:</td>
              <td style="font-family: monospace;">${razorpayPaymentId || "VERIFIED"}</td>
            </tr>
            <tr class="total-row">
              <td class="label">Total Paid:</td>
              <td style="color: #933d2d;">₹${Number(totalAmount).toLocaleString("en-IN")}</td>
            </tr>
          </table>

          <p style="font-size: 13px; color: #5a3d28;">
            Please present this confirmation email or your Booking Reference Number (<strong>${bookingReference}</strong>) at hotel reception during check-in.
          </p>
        </div>
        <div class="footer">
          <p><strong>Hotel Rajmahal Palace</strong></p>
          <p>Rajmahal Estates, Heritage Valley Road • Reservations: +91 98765 43210</p>
          <p style="margin-top: 10px; font-size: 11px; color: #762f22;">Thank you for choosing Hotel Rajmahal Palace.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"Hotel Rajmahal Palace" <${smtpUser}>`,
        to: customerEmail,
        subject: `Booking Confirmed: Hotel Rajmahal Palace [${bookingReference}]`,
        html: htmlTemplate,
      });

      console.log(`[EMAIL DISPATCH] Email successfully sent to ${customerEmail} via SMTP!`);
    } else {
      console.log(`[EMAIL DISPATCH] SMTP credentials not set. Simulated successful email delivery to ${customerEmail}.`);
    }

    return NextResponse.json({
      success: true,
      message: `Confirmation email dispatched for ${bookingReference}`,
    });
  } catch (err) {
    console.error("[EMAIL ERROR]", err);
    return NextResponse.json(
      { error: "Failed to dispatch confirmation email", details: err.message },
      { status: 500 }
    );
  }
}
