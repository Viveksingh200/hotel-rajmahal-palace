
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@supabase/supabase-js";
import { ROOMS_DATA } from "@/data/rooms";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY;

export async function POST(req) {
  try {
    const body = await req.json();
    const { roomId, checkIn, checkOut, guests, guestInfo } = body;

    if (!roomId || !checkIn || !checkOut || !guestInfo?.email) {
      return NextResponse.json({ error: "Missing required booking details" }, { status: 400 });
    }

    // 1. Calculate Nights
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    // 2. Fetch Authoritative Room & Price from DB
    let roomPrice = null;
    let roomName = "";
    let validRoomId = null;

    if (supabaseUrl && supabaseServiceKey && !supabaseUrl.includes("placeholder")) {
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

      // Check DB room price & status matching by UUID or slug
      const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(roomId);

      let query = supabaseAdmin.from("rooms").select("*");
      if (isUuid) {
        query = query.eq("id", roomId);
      } else {
        query = query.eq("slug", roomId);
      }

      const { data: dbRoom } = await query.maybeSingle();

      if (dbRoom) {
        if (dbRoom.availability_status !== "available") {
          return NextResponse.json(
            { error: `Room ${dbRoom.room_name} is currently marked as '${dbRoom.availability_status}'` },
            { status: 400 }
          );
        }
        roomPrice = Number(dbRoom.price_per_night);
        roomName = dbRoom.room_name;
        validRoomId = dbRoom.id;
      }
    }

    if (roomPrice === null || roomPrice === undefined) {
      const fallbackRoom =
        ROOMS_DATA.find((r) => r.id === roomId || r.slug === roomId || r.roomNumber === roomId) ||
        ROOMS_DATA[0];
      roomPrice = Number(fallbackRoom.pricePerNight);
      roomName = fallbackRoom.name;
      validRoomId = fallbackRoom.id;
    }


    // 3. SERVER-SIDE PRICE CALCULATION (SECURITY: NEVER trust client amount)
    const roomSubtotal = roomPrice * nights;
    const taxesAndFees = Math.round(roomSubtotal * 0.18); // 18% GST / luxury tax
    const totalAmount = roomSubtotal + taxesAndFees; // In Dollars / Rupees

    // 4. Generate unique Booking Reference
    const bookingRef = `RMP-${Math.floor(100000 + Math.random() * 900000)}`;

    const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    let razorpayOrderId = `demo_order_${Math.floor(100000 + Math.random() * 900000)}`;

    // 5. If Razorpay Secret Key is available, create REAL Razorpay Order
    if (
      razorpayKeyId &&
      razorpayKeySecret &&
      !razorpayKeyId.includes("rzp_test_your_key") &&
      !razorpayKeySecret.includes("...")
    ) {
      try {
        const instance = new Razorpay({
          key_id: razorpayKeyId.trim(),
          key_secret: razorpayKeySecret.trim(),
        });

        const orderOptions = {
          amount: Math.round(totalAmount * 100),
          currency: "INR",
          receipt: bookingRef,
          notes: {
            booking_reference: bookingRef,
            customer_email: guestInfo.email,
            room_name: roomName,
          },
        };

        const razorpayOrder = await instance.orders.create(orderOptions);
        razorpayOrderId = razorpayOrder.id;
      } catch (rzpErr) {
        console.error("Razorpay SDK Order Error:", rzpErr);
        return NextResponse.json(
          {
            error:
              "Razorpay API Error: Incomplete or invalid RAZORPAY_KEY_SECRET in .env.local. Please copy your full secret string from your Razorpay Dashboard.",
            details: rzpErr.message || rzpErr.description,
          },
          { status: 400 }
        );
      }
    } else if (razorpayKeySecret && razorpayKeySecret.includes("...")) {
      return NextResponse.json(
        {
          error:
            "Incomplete RAZORPAY_KEY_SECRET in .env.local: The secret key currently contains '...'. Please paste your full un-truncated secret key from Razorpay Dashboard into line 17 of .env.local.",
        },
        { status: 400 }
      );
    }


    // 6. Save Pending Booking to Supabase (if configured)
    let bookingId = `b-${Date.now()}`;
    if (supabaseUrl && supabaseServiceKey && !supabaseUrl.includes("placeholder")) {
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
      const { data: insertedBooking } = await supabaseAdmin
        .from("bookings")
        .insert([
          {
            booking_reference: bookingRef,
            customer_name: `${guestInfo.firstName} ${guestInfo.lastName}`,
            customer_email: guestInfo.email,
            customer_phone: guestInfo.phone,
            special_requests: guestInfo.specialRequests || "",
            room_id: validRoomId || roomId,
            check_in: checkIn,

            check_out: checkOut,
            guests: Number(guests || 1),
            rooms_count: 1,
            nights,
            room_subtotal: roomSubtotal,
            taxes_and_fees: taxesAndFees,
            total_amount: totalAmount,
            payment_status: "pending",
            booking_status: "pending",
            razorpay_order_id: razorpayOrderId,
          },
        ])
        .select()
        .single();

      if (insertedBooking) {
        bookingId = insertedBooking.id;
      }
    }

    return NextResponse.json({
      success: true,
      orderId: razorpayOrderId,
      bookingId,
      bookingReference: bookingRef,
      amount: totalAmount,
      amountInPaise: Math.round(totalAmount * 100),
      currency: "INR",
      keyId: razorpayKeyId || "rzp_test_demo_key",
      nights,
      roomSubtotal,
      taxesAndFees,
      roomName,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json({ error: error.message || "Failed to create payment order" }, { status: 500 });
  }
}
