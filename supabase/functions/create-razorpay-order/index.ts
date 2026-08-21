import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { roomId, checkIn, checkOut, guests, guestInfo } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Calculate nights
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

    // Fetch DB Room Price
    const { data: room, error: roomErr } = await supabaseAdmin
      .from("rooms")
      .select("*")
      .eq("id", roomId)
      .single();

    if (roomErr || !room) {
      return new Response(JSON.stringify({ error: "Room not found" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (room.availability_status !== "available") {
      return new Response(JSON.stringify({ error: `Room ${room.room_name} is currently ${room.availability_status}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const pricePerNight = Number(room.price_per_night);
    const roomSubtotal = pricePerNight * nights;
    const taxesAndFees = Math.round(roomSubtotal * 0.18);
    const totalAmount = roomSubtotal + taxesAndFees;

    const bookingRef = `RMP-${Math.floor(100000 + Math.random() * 900000)}`;

    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID") || "rzp_test_demo";
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    let orderId = `order_${Math.floor(100000 + Math.random() * 900000)}`;

    if (razorpayKeySecret && !razorpayKeyId.includes("demo")) {
      const basicAuth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
      const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(totalAmount * 100),
          currency: "INR",
          receipt: bookingRef,
        }),
      });

      const rzpData = await rzpRes.json();
      if (rzpData.id) orderId = rzpData.id;
    }

    // Insert pending booking into Supabase
    const { data: booking } = await supabaseAdmin
      .from("bookings")
      .insert([
        {
          booking_reference: bookingRef,
          customer_name: `${guestInfo.firstName} ${guestInfo.lastName}`,
          customer_email: guestInfo.email,
          customer_phone: guestInfo.phone,
          special_requests: guestInfo.specialRequests || "",
          room_id: roomId,
          check_in: checkIn,
          check_out: checkOut,
          guests: Number(guests),
          nights,
          room_subtotal: roomSubtotal,
          taxes_and_fees: taxesAndFees,
          total_amount: totalAmount,
          payment_status: "pending",
          booking_status: "pending",
          razorpay_order_id: orderId,
        },
      ])
      .select()
      .single();

    return new Response(
      JSON.stringify({
        success: true,
        orderId,
        bookingId: booking?.id || `b-${Date.now()}`,
        bookingReference: bookingRef,
        amount: totalAmount,
        amountInPaise: Math.round(totalAmount * 100),
        currency: "INR",
        keyId: razorpayKeyId,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
