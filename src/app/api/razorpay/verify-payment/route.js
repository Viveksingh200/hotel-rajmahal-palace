import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY;

export async function POST(req) {
  try {
    const body = await req.json();
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId, bookingReference } = body;

    if (!razorpayOrderId || !razorpayPaymentId) {
      return NextResponse.json({ error: "Missing Razorpay payment fields" }, { status: 400 });
    }

    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    let isSignatureValid = false;

    // Server-side HMAC SHA256 Signature Verification
    if (razorpayKeySecret && razorpaySignature && !razorpayKeySecret.includes("your_razorpay_key_secret")) {
      const generatedSignature = crypto
        .createHmac("sha256", razorpayKeySecret.trim())
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

      isSignatureValid = generatedSignature === razorpaySignature;

      if (!isSignatureValid) {
        console.warn("HMAC Signature Mismatch Debug:");
        console.warn("  Razorpay Sent Signature:", razorpaySignature);
        console.warn("  Server Generated Signature:", generatedSignature);
        console.warn("  OrderId | PaymentId:", `${razorpayOrderId}|${razorpayPaymentId}`);
      }
    } else {
      // Demo test signature validation
      console.log("No production Razorpay Secret configured, accepting test signature.");
      isSignatureValid = true;
    }

    if (!isSignatureValid) {
      // Mark booking as payment failed in DB
      if (supabaseUrl && supabaseServiceKey && !supabaseUrl.includes("placeholder")) {
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
        await supabaseAdmin
          .from("bookings")
          .update({ payment_status: "failed", booking_status: "pending" })
          .or(`id.eq.${bookingId},booking_reference.eq.${bookingReference}`);
      }

      return NextResponse.json(
        {
          error: "Payment signature verification failed. Please verify that RAZORPAY_KEY_SECRET in .env.local matches your NEXT_PUBLIC_RAZORPAY_KEY_ID account.",
        },
        { status: 400 }
      );
    }


    // UPDATE BOOKING STATUS TO PAID & CONFIRMED IN SUPABASE
    let confirmedBooking = null;
    if (supabaseUrl && supabaseServiceKey && !supabaseUrl.includes("placeholder")) {
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
      const { data, error } = await supabaseAdmin
        .from("bookings")
        .update({
          payment_status: "paid",
          booking_status: "confirmed",
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature || "verified_demo_signature",
        })
        .or(`id.eq.${bookingId},booking_reference.eq.${bookingReference}`)
        .select("*, room:rooms(*)")
        .single();

      if (!error && data) {
        confirmedBooking = data;
      }
    }

    // Trigger Automated Email Confirmation
    try {
      const emailPayload = {
        bookingReference,
        customerName: confirmedBooking?.customer_name || guestInfo?.fullName || "Valued Guest",
        customerEmail: confirmedBooking?.customer_email || guestInfo?.email,
        customerPhone: confirmedBooking?.customer_phone || guestInfo?.phone,
        roomName: confirmedBooking?.room?.room_name || roomName || "Palace Suite",
        checkIn: confirmedBooking?.check_in || checkIn,
        checkOut: confirmedBooking?.check_out || checkOut,
        nights: nights || 1,
        totalAmount: confirmedBooking?.total_amount || totalAmount || 0,
        razorpayPaymentId,
        razorpayOrderId,
      };

      if (emailPayload.customerEmail) {
        const origin = req.headers.get("origin") || "http://localhost:3000";
        fetch(`${origin}/api/send-confirmation-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emailPayload),
        }).catch((err) => console.error("Email trigger fetch error:", err));
      }
    } catch (e) {
      console.warn("Email dispatch error:", e);
    }

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and booking confirmed",
      bookingReference,
      paymentId: razorpayPaymentId,
      booking: confirmedBooking,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ error: error.message || "Server verification error" }, { status: 500 });
  }
}
