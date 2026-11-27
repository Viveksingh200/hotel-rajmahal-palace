import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://toqcichgylvlzxzyhled.supabase.co";
const supabaseServiceKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_3ZEw-XUy7Y1-ewEx9x7qow_lNsG0b7d";

export async function POST(req) {
  try {
    const body = await req.json();
    const { bookingId, bookingReference, reason } = body;

    if (supabaseUrl && supabaseServiceKey && !supabaseUrl.includes("placeholder")) {
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
      await supabaseAdmin
        .from("bookings")
        .update({
          payment_status: "failed",
          booking_status: "pending",
        })
        .or(`id.eq.${bookingId},booking_reference.eq.${bookingReference}`);
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
