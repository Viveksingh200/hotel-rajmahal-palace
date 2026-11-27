import { supabase, isSupabaseConfigured } from "./supabase/client";
import { ROOMS_DATA } from "@/data/rooms";

// Local state fallback storage key for offline prototype persistence
const LOCAL_BOOKINGS_KEY = "rajmahal_bookings_v9";
const LOCAL_ROOMS_KEY = "rajmahal_rooms_v9";

// Helper: Get offline rooms fallback
const getLocalRooms = () => {
  if (typeof window === "undefined") return ROOMS_DATA;
  const stored = localStorage.getItem(LOCAL_ROOMS_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length === ROOMS_DATA.length) {
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
  }
  const initial = ROOMS_DATA.map((r) => ({
    id: r.id,
    room_number: "",
    room_name: r.name,
    room_type: r.slug.replace("-room", "").replace("-suite", ""),
    slug: r.slug,
    description: r.description,
    price_per_night: r.pricePerNight,
    max_guests: r.maxGuests || 3,
    max_adults: r.maxAdults || 2,
    max_children: r.maxChildren || 1,
    bed_type: r.bedType,
    view_type: r.view,
    image_url: r.featuredImage,
    gallery: r.gallery,
    amenities: r.amenities,
    highlights: r.highlights,
    availability_status: "available",
    is_active: true,
  }));
  localStorage.setItem(LOCAL_ROOMS_KEY, JSON.stringify(initial));
  return initial;
};

// Helper: Get offline bookings fallback
const getLocalBookings = () => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(LOCAL_BOOKINGS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
  }
  const pastDate1 = new Date(Date.now() - 86400000 * 10).toISOString().split("T")[0];
  const pastDate2 = new Date(Date.now() - 86400000 * 8).toISOString().split("T")[0];

  const sample = [
    {
      id: "demo-b1",
      booking_reference: "RMP-918234",
      customer_name: "Maharaja Vikramaditya Singh",
      customer_email: "vikram@rajmahal.in",
      customer_phone: "+91 98290 12345",
      special_requests: "High floor balcony suite, early morning high tea setup",
      room_id: "heritage-deluxe-room",
      check_in: pastDate1,
      check_out: pastDate2,
      guests: 3,
      rooms_count: 1,
      nights: 2,
      room_subtotal: 6000,
      taxes_and_fees: 0,
      total_amount: 6000,
      payment_status: "paid",
      booking_status: "confirmed",
      razorpay_order_id: "order_N8291047192",
      razorpay_payment_id: "pay_P9182740192",
      created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
      room: ROOMS_DATA[0],
    },
  ];
  localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(sample));
  return sample;
};

/**
 * Fetch all rooms from Supabase (or fallback)
 */
export async function fetchRooms() {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .order("price_per_night", { ascending: true });
      if (!error && data && data.length > 0) {
        const normalized = data.map((r) => {
          const livePrice = Number(r.price_per_night !== undefined ? r.price_per_night : r.pricePerNight);
          return {
            ...r,
            price_per_night: livePrice,
            pricePerNight: livePrice,
          };
        });
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(LOCAL_ROOMS_KEY, JSON.stringify(normalized));
          } catch (e) {
            console.error(e);
          }
        }
        return normalized;
      }
    } catch (err) {
      console.warn("Supabase rooms query fallback:", err);
    }
  }
  return getLocalRooms();
}

/**
 * Check room availability for given dates & guest count against Supabase DB
 */
export async function fetchAvailableRooms(checkIn, checkOut, guests = 1) {
  // Always fetch live rooms directly from Supabase first so room prices & details are 100% current
  const allRooms = await fetchRooms();
  if (!allRooms || allRooms.length === 0) return getLocalRooms();
  if (!checkIn || !checkOut) return allRooms;

  if (isSupabaseConfigured()) {
    try {
      // 1. Fetch only confirmed or recently initiated (< 15 min) bookings that overlap with requested dates
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
      const { data: overlappingBookings, error: bookingErr } = await supabase
        .from("bookings")
        .select("room_id, rooms_count, booking_status, payment_status, created_at")
        .neq("payment_status", "failed")
        .neq("booking_status", "cancelled")
        .lt("check_in", checkOut)
        .gt("check_out", checkIn);

      if (!bookingErr && overlappingBookings) {
        // Filter out abandoned unpaid checkouts
        const activeBookings = overlappingBookings.filter((b) => {
          if (b.booking_status === "confirmed" || b.payment_status === "paid") return true;
          if (b.booking_status === "pending" && b.payment_status === "pending") {
            return b.created_at && b.created_at >= fifteenMinutesAgo;
          }
          return false;
        });

        // Sum booked rooms per room_id (Hotel has 8 identical Heritage Deluxe Rooms)
        const bookedCountByRoomId = {};
        for (const b of activeBookings) {
          const rId = b.room_id;
          const count = Number(b.rooms_count) || 1;
          bookedCountByRoomId[rId] = (bookedCountByRoomId[rId] || 0) + count;
        }

        const TOTAL_INVENTORY = 8;

        return allRooms.map((room) => {
          const bookedCount = bookedCountByRoomId[room.id] || 0;
          const remainingInventory = Math.max(0, TOTAL_INVENTORY - bookedCount);
          const isAvailable = remainingInventory > 0 && room.availability_status === "available" && room.is_active;

          const livePrice = Number(
            room.price_per_night !== undefined
              ? room.price_per_night
              : (room.pricePerNight !== undefined ? room.pricePerNight : 1)
          );

          return {
            ...room,
            price_per_night: livePrice,
            pricePerNight: livePrice,
            remaining_inventory: remainingInventory,
            availability_status: isAvailable ? "available" : "sold_out",
          };
        });
      }
    } catch (err) {
      console.warn("Supabase availability check fallback:", err);
    }
  }

  return allRooms.map((room) => {
    const livePrice = Number(
      room.price_per_night !== undefined
        ? room.price_per_night
        : (room.pricePerNight !== undefined ? room.pricePerNight : 1)
    );
    return {
      ...room,
      price_per_night: livePrice,
      pricePerNight: livePrice,
    };
  });
}

/**
 * Update Room Availability Status (Owner action)
 */
export async function updateRoomAvailability(roomId, newStatus) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("rooms")
        .update({ availability_status: newStatus })
        .eq("id", roomId)
        .select()
        .single();
      if (!error && data) return { success: true, room: data };
    } catch (err) {
      console.error("Supabase status update error:", err);
    }
  }

  // Local fallback update
  const rooms = getLocalRooms();
  const updated = rooms.map((r) => (r.id === roomId ? { ...r, availability_status: newStatus } : r));
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_ROOMS_KEY, JSON.stringify(updated));
  }
  return { success: true, room: updated.find((r) => r.id === roomId) };
}

/**
 * Update Room Price per night (Admin/Owner action)
 */
export async function updateRoomPrice(roomId, newPrice) {
  const numericPrice = Math.max(1, Number(newPrice));

  try {
    const res = await fetch("/api/admin/rooms/update-price", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, price: numericPrice }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      const rooms = getLocalRooms();
      const updated = rooms.map((r) =>
        r.id === roomId || r.slug === roomId
          ? { ...r, price_per_night: numericPrice, pricePerNight: numericPrice }
          : r
      );
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_ROOMS_KEY, JSON.stringify(updated));
      }
      return { success: true, price: numericPrice, room: data.room };
    }
  } catch (err) {
    console.error("API price update fallback:", err);
  }

  // Direct Supabase fallback
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("rooms")
        .update({ price_per_night: numericPrice })
        .eq("id", roomId)
        .select()
        .single();
      if (!error && data) {
        const rooms = getLocalRooms();
        const updated = rooms.map((r) =>
          r.id === roomId ? { ...r, price_per_night: numericPrice, pricePerNight: numericPrice } : r
        );
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_ROOMS_KEY, JSON.stringify(updated));
        }
        return { success: true, price: numericPrice, room: data };
      }
    } catch (err) {
      console.error("Direct Supabase price update error:", err);
    }
  }

  // Local storage fallback
  const rooms = getLocalRooms();
  const updated = rooms.map((r) =>
    r.id === roomId ? { ...r, price_per_night: numericPrice, pricePerNight: numericPrice } : r
  );
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_ROOMS_KEY, JSON.stringify(updated));
  }
  return { success: true, price: numericPrice, room: updated.find((r) => r.id === roomId) };
}

/**
 * Fetch Bookings for Admin Dashboard with filtering & search
 */
export async function fetchAdminBookings(filters = {}) {
  const { search, status, paymentStatus, roomId, dateFrom, dateTo } = filters;

  if (isSupabaseConfigured()) {
    try {
      let query = supabase
        .from("bookings")
        .select("*, room:rooms(*)")
        .order("created_at", { ascending: false });

      if (status && status !== "all") query = query.eq("booking_status", status);
      if (paymentStatus && paymentStatus !== "all") query = query.eq("payment_status", paymentStatus);
      if (roomId && roomId !== "all") query = query.eq("room_id", roomId);
      if (dateFrom) query = query.gte("check_in", dateFrom);
      if (dateTo) query = query.lte("check_out", dateTo);

      if (search && search.trim()) {
        const s = search.trim();
        query = query.or(
          `customer_name.ilike.%${s}%,customer_phone.ilike.%${s}%,booking_reference.ilike.%${s}%,customer_email.ilike.%${s}%`
        );
      }

      const { data, error } = await query;
      if (!error && data) return data;
    } catch (err) {
      console.warn("Supabase admin bookings fallback:", err);
    }
  }

  // Fallback filtering
  let bookings = getLocalBookings();

  if (status && status !== "all") {
    bookings = bookings.filter((b) => b.booking_status === status);
  }
  if (paymentStatus && paymentStatus !== "all") {
    bookings = bookings.filter((b) => b.payment_status === paymentStatus);
  }
  if (roomId && roomId !== "all") {
    bookings = bookings.filter((b) => b.room_id === roomId || b.room?.id === roomId);
  }
  if (dateFrom) {
    bookings = bookings.filter((b) => b.check_in >= dateFrom);
  }
  if (dateTo) {
    bookings = bookings.filter((b) => b.check_out <= dateTo);
  }
  if (search && search.trim()) {
    const term = search.trim().toLowerCase();
    bookings = bookings.filter(
      (b) =>
        b.customer_name?.toLowerCase().includes(term) ||
        b.customer_phone?.toLowerCase().includes(term) ||
        b.customer_email?.toLowerCase().includes(term) ||
        b.booking_reference?.toLowerCase().includes(term)
    );
  }

  return bookings;
}

/**
 * Fetch Single Booking by Reference ID, Email, or Phone for Customer Verification
 */
export async function fetchBookingByReference(searchQuery) {
  if (!searchQuery || !searchQuery.trim()) return null;
  const q = searchQuery.trim();

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, room:rooms(*)")
        .or(`booking_reference.ilike.${q},customer_email.ilike.${q},customer_phone.ilike.${q}`)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) return data;
    } catch (err) {
      console.warn("Supabase booking lookup fallback:", err);
    }
  }

  // Fallback local lookup
  const bookings = getLocalBookings();
  return (
    bookings.find(
      (b) =>
        b.booking_reference?.toLowerCase() === q.toLowerCase() ||
        b.customer_email?.toLowerCase() === q.toLowerCase() ||
        b.customer_phone === q
    ) || null
  );
}

/**
 * Fetch All Bookings for Current User (by Auth Email or Recent Session References)
 */
export async function fetchUserBookings(userEmail, recentRefs = []) {
  if (isSupabaseConfigured()) {
    try {
      let query = supabase.from("bookings").select("*, room:rooms(*)").order("created_at", { ascending: false });

      if (userEmail && recentRefs.length > 0) {
        query = query.or(`customer_email.ilike.${userEmail},booking_reference.in.(${recentRefs.join(",")})`);
      } else if (userEmail) {
        query = query.ilike("customer_email", userEmail);
      } else if (recentRefs.length > 0) {
        query = query.in("booking_reference", recentRefs);
      } else {
        return [];
      }

      const { data, error } = await query;
      if (!error && data) return data;
    } catch (err) {
      console.warn("Supabase user bookings fetch fallback:", err);
    }
  }

  // Local fallback
  const localBookings = getLocalBookings();
  return localBookings.filter((b) => {
    if (userEmail && b.customer_email?.toLowerCase() === userEmail.toLowerCase()) return true;
    if (recentRefs.includes(b.booking_reference)) return true;
    return false;
  });
}



/**
 * Update Booking Status (Owner action)
 */
export async function updateBookingStatus(bookingId, bookingStatus, paymentStatus) {
  const updates = {};
  if (bookingStatus) updates.booking_status = bookingStatus;
  if (paymentStatus) updates.payment_status = paymentStatus;

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .update(updates)
        .eq("id", bookingId)
        .select()
        .single();
      if (!error && data) return { success: true, booking: data };
    } catch (err) {
      console.error("Supabase booking update error:", err);
    }
  }

  // Local update fallback
  const bookings = getLocalBookings();
  const updated = bookings.map((b) => (b.id === bookingId ? { ...b, ...updates } : b));
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(updated));
  }
  return { success: true, booking: updated.find((b) => b.id === bookingId) };
}

/**
 * Fetch Overview Metrics for Hotel Dashboard
 */
export async function fetchDashboardMetrics() {
  const bookings = await fetchAdminBookings();
  const rooms = await fetchRooms();

  const today = new Date().toISOString().split("T")[0];

  const todayArrivals = bookings.filter((b) => b.check_in === today && b.booking_status !== "cancelled");
  const todayDepartures = bookings.filter((b) => b.check_out === today && b.booking_status !== "cancelled");

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.booking_status === "confirmed").length;
  const pendingPayments = bookings.filter((b) => b.payment_status === "pending").length;

  const totalRevenue = bookings
    .filter((b) => b.payment_status === "paid")
    .reduce((sum, b) => sum + Number(b.total_amount || 0), 0);

  const TOTAL_ROOMS = 8;
  const isMasterAvailable = !rooms.some((r) => r.availability_status === "unavailable" || r.availability_status === "maintenance");

  // Calculate currently active bookings spanning today
  const currentlyOccupied = bookings.filter(
    (b) => b.booking_status === "confirmed" && b.check_in <= today && b.check_out > today
  ).length;

  const availableRoomsCount = isMasterAvailable ? Math.max(0, TOTAL_ROOMS - currentlyOccupied) : 0;
  const unavailableRoomsCount = TOTAL_ROOMS - availableRoomsCount;

  return {
    todayArrivalsCount: todayArrivals.length,
    todayDeparturesCount: todayDepartures.length,
    totalBookings,
    confirmedBookings,
    pendingPayments,
    totalRevenue,
    availableRoomsCount,
    unavailableRoomsCount,
    totalRoomsCount: TOTAL_ROOMS,
    todayArrivals,
    todayDepartures,
    recentBookings: bookings.slice(0, 5),
  };
}

/**
 * Create a new Booking Record (Public booking creation)
 */
export async function createBookingRecord(bookingPayload) {
  const todayStr = new Date().toISOString().split("T")[0];
  if (bookingPayload.checkIn < todayStr) {
    return { success: false, error: "Check-in date cannot be in the past" };
  }
  if (bookingPayload.checkOut <= bookingPayload.checkIn) {
    return { success: false, error: "Check-out date must be after check-in date" };
  }

  const reference = `RMP-${Math.floor(100000 + Math.random() * 900000)}`;

  const record = {
    booking_reference: reference,
    customer_name: `${bookingPayload.guestInfo.firstName} ${bookingPayload.guestInfo.lastName}`,
    customer_email: bookingPayload.guestInfo.email,
    customer_phone: bookingPayload.guestInfo.phone,
    special_requests: bookingPayload.guestInfo.specialRequests || "",
    room_id: bookingPayload.room.id,
    check_in: bookingPayload.checkIn,
    check_out: bookingPayload.checkOut,
    guests: Number(bookingPayload.guests || 1),
    rooms_count: Number(bookingPayload.roomsCount || 1),
    nights: Number(bookingPayload.nights || 1),
    room_subtotal: Number(bookingPayload.roomSubtotal),
    taxes_and_fees: Number(bookingPayload.taxesAndFees),
    total_amount: Number(bookingPayload.grandTotal),
    payment_status: bookingPayload.paymentStatus || "pending",
    booking_status: bookingPayload.bookingStatus || "pending",
    razorpay_order_id: bookingPayload.razorpayOrderId || null,
    razorpay_payment_id: bookingPayload.razorpayPaymentId || null,
  };

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from("bookings").insert([record]).select("*, room:rooms(*)").single();
      if (!error && data) return { success: true, booking: data };
    } catch (err) {
      console.error("Supabase booking insert error:", err);
    }
  }

  // Local state fallback
  const localRecord = {
    ...record,
    id: `local-b-${Date.now()}`,
    created_at: new Date().toISOString(),
    room: bookingPayload.room,
  };

  const currentBookings = getLocalBookings();
  currentBookings.unshift(localRecord);
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(currentBookings));
  }

  return { success: true, booking: localRecord };
}

/**
 * Fetch Booking by Reference
 */
export async function getBookingByReference(reference) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, room:rooms(*)")
        .eq("booking_reference", reference)
        .single();
      if (!error && data) return data;
    } catch (err) {
      console.warn("Supabase fetch reference fallback:", err);
    }
  }

  const bookings = getLocalBookings();
  return bookings.find((b) => b.booking_reference === reference) || null;
}
