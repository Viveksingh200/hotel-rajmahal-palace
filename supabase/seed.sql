-- =========================================================
-- Hotel Rajmahal Palace — Seed Data
-- 1. Heritage Deluxe Room (₹3000, Max 3 Adults + 2 Children)
-- =========================================================

TRUNCATE TABLE public.bookings CASCADE;
TRUNCATE TABLE public.rooms CASCADE;

INSERT INTO public.rooms (
    id,
    room_number,
    room_name,
    room_type,
    slug,
    description,
    price_per_night,
    max_guests,
    max_adults,
    max_children,
    bed_type,
    view_type,
    image_url,
    gallery,
    amenities,
    highlights,
    availability_status,
    is_active
) VALUES
(
    '11111111-1111-1111-1111-111111111101',
    'PALACE-101',
    'Heritage Deluxe Room',
    'Heritage Deluxe',
    'heritage-deluxe-room',
    'Designed with warm cream walls, polished teak furnishings, and dark grey marble flooring. The Heritage Deluxe Room offers a tranquil retreat accommodating up to 3 adults and 2 children, featuring hand-loomed bedding, high ceilings, and ambient warm lighting.',
    3000.00,
    5,
    3,
    2,
    'King Heritage Bed',
    'Palace Courtyard & Hill Garden',
    '/images/heritage-deluxe-room.jpg',
    '["/images/heritage-deluxe-room.jpg", "/images/bedroom.jpg", "/images/bathroom.jpg", "/images/balcony.jpg"]'::jsonb,
    '["Two Towels", "Mattress", "Blanket", "Pillows", "Bedsheet", "Shampoo", "Shower Gel", "Electric Kettle", "Mineral Water Bottles"]'::jsonb,
    '["Max 3 Adults & 2 Children", "Courtyard View", "Dark Marble Bath", "Private Balcony"]'::jsonb,
    'available',
    true
)
ON CONFLICT (id) DO UPDATE SET
    room_number = EXCLUDED.room_number,
    room_name = EXCLUDED.room_name,
    price_per_night = EXCLUDED.price_per_night,
    max_adults = EXCLUDED.max_adults,
    max_children = EXCLUDED.max_children,
    max_guests = EXCLUDED.max_guests,
    availability_status = EXCLUDED.availability_status;

