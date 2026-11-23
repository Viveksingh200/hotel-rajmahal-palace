import { createClient } from "@supabase/supabase-js";
import { ROOMS_DATA } from "../src/data/rooms.js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncRooms() {
  console.log("Syncing Supabase rooms table...");

  // 1. Delete all bookings referencing old rooms first
  const { error: bError } = await supabase.from("bookings").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (bError) console.warn("Bookings clear note:", bError.message);

  // 2. Delete all existing rooms
  const { error: deleteError } = await supabase.from("rooms").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (deleteError) console.warn("Rooms delete note:", deleteError.message);

  // 3. Insert the single luxury room
  const rows = ROOMS_DATA.map((r, i) => ({
    id: "11111111-1111-1111-1111-111111111101",
    room_number: "PALACE-101",
    room_name: r.name,
    room_type: r.slug.replace("-room", "").replace("-suite", ""),
    slug: r.slug,
    description: r.description,
    price_per_night: r.pricePerNight,
    max_guests: r.maxGuests,
    max_adults: r.maxAdults,
    max_children: r.maxChildren,
    bed_type: r.bedType,
    view_type: r.view,
    image_url: r.featuredImage,
    gallery: r.gallery,
    amenities: r.amenities,
    highlights: r.highlights,
    availability_status: "available",
    is_active: true,
  }));

  const { data, error: insertError } = await supabase.from("rooms").insert(rows).select();
  if (insertError) {
    console.error("Insert error:", insertError);
  } else {
    console.log("Successfully synced room into Supabase:", data);
  }
}

syncRooms();

