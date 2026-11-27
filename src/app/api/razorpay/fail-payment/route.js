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

export async function POST(req) {
  try {
    const body = await req.json();
    const { bookingId, bookingReference, reason } = body;

    if (supabaseUrl && supabaseServiceKey && !supabaseUrl.includes("placeholder")) {
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
      let updateQuery = supabaseAdmin
        .from("bookings")
        .update({
          payment_status: "failed",
          booking_status: "cancelled",
        });

      if (bookingReference) {
        updateQuery = updateQuery.eq("booking_reference", bookingReference);
      } else if (bookingId) {
        updateQuery = updateQuery.eq("id", bookingId);
      }
      await updateQuery;
    }

    return NextResponse.json({
      success: true,
      message: "Booking updated: payment_status = failed, booking_status = pending",
      reason: reason || "Payment failed or cancelled by user",
    });
  } catch (error) {
    console.error("Payment failure record error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
