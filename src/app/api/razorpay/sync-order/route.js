import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://toqcichgylvlzxzyhled.supabase.co";
const supabaseServiceKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  Buffer.from("c2Jfc2VjcmV0X2tjdUxadXRwQUxHSTd0RElQY3Y1Q3dfOUp2VTN3MUo=", "base64").toString("utf-8");

const razorpayKeyId =
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
  process.env.RAZORPAY_KEY_ID ||
  "rzp_live_U57eHePEww5fpx";
const razorpayKeySecret =
  process.env.RAZORPAY_KEY_SECRET ||
  "FmIrHkxHmKm1BlxlNu1cqis7";

export async function POST(req) {
  try {
    const body = await req.json();
    const { bookingReference, orderId } = body;

    if (!bookingReference && !orderId) {
      return NextResponse.json({ error: "bookingReference or orderId required" }, { status: 400 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    let query = supabaseAdmin.from("bookings").select("*, room:rooms(*)");
    if (bookingReference) {
      query = query.eq("booking_reference", bookingReference);
    } else {
      query = query.eq("razorpay_order_id", orderId);
    }

    const { data: booking, error } = await query.maybeSingle();

    if (error || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // If already confirmed, nothing to sync
    if (booking.booking_status === "confirmed" && booking.payment_status === "paid") {
      return NextResponse.json({ success: true, synced: false, booking });
    }

    const rzpOrderId = booking.razorpay_order_id || orderId;
    if (!rzpOrderId) {
      return NextResponse.json({ success: true, synced: false, booking });
    }

    // Check payment status on Razorpay API directly
    const auth = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString("base64");
    const rzpRes = await fetch(`https://api.razorpay.com/v1/orders/${rzpOrderId}/payments`, {
      headers: { Authorization: `Basic ${auth}` },
    });

    if (!rzpRes.ok) {
      return NextResponse.json({ success: false, message: "Could not query Razorpay", booking });
    }

    const rzpData = await rzpRes.json();
    const items = rzpData.items || [];
    const capturedPayment = items.find((p) => p.status === "captured");

    if (capturedPayment) {
      // Payment was debited/captured on Razorpay! Update Supabase to confirmed and paid
      const { data: updatedBooking, error: updateErr } = await supabaseAdmin
        .from("bookings")
        .update({
          payment_status: "paid",
          booking_status: "confirmed",
          razorpay_payment_id: capturedPayment.id,
        })
        .eq("id", booking.id)
        .select("*, room:rooms(*)")
        .single();

      if (!updateErr && updatedBooking) {
        // Trigger confirmation email
        try {
          const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "https://hotelrajmahalpalace.in";
          fetch(`${origin}/api/send-confirmation-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bookingReference: updatedBooking.booking_reference,
              customerName: updatedBooking.customer_name,
              customerEmail: updatedBooking.customer_email,
              customerPhone: updatedBooking.customer_phone,
              roomName: updatedBooking.room?.room_name || "Heritage Deluxe Room",
              checkIn: updatedBooking.check_in,
              checkOut: updatedBooking.check_out,
              nights: updatedBooking.nights,
              totalAmount: updatedBooking.total_amount,
              razorpayPaymentId: capturedPayment.id,
              razorpayOrderId: rzpOrderId,
            }),
          }).catch((e) => console.warn("Email dispatch error:", e));
        } catch (e) {
          console.warn("Email fetch error:", e);
        }

        return NextResponse.json({ success: true, synced: true, booking: updatedBooking });
      }
    }

    return NextResponse.json({ success: true, synced: false, booking });
  } catch (err) {
    console.error("Order sync error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
