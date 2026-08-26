-- =========================================================
-- Hotel Rajmahal Palace — Seed Data
-- 1. Heritage Deluxe Room (500 Sq Ft, Max 3 Adults + 2 Children)
-- 2. Royal Heritage Suite (700 Sq Ft, Max 4 Adults + 3 Children)
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
    size_sq_ft,
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
    '',
    'Heritage Deluxe Room',
    'Heritage Deluxe',
    'heritage-deluxe-room',
    'Designed with warm cream walls, polished teak furnishings, and dark grey marble flooring. The Heritage Deluxe Room offers a tranquil 500 sq ft retreat accommodating up to 3 adults and 2 children, featuring hand-loomed bedding, high ceilings, and ambient warm lighting.',
    14000.00,
    5,
    3,
    2,
    500,
    'King Heritage Bed',
    'Palace Courtyard & Hill Garden',
    '/images/heritage-deluxe-room.jpg',
    '["/images/heritage-deluxe-room.jpg", "/images/bedroom.jpg", "/images/bathroom.jpg", "/images/balcony.jpg"]'::jsonb,
    '["King-size handcrafted teak bed", "En-suite charcoal marble bathroom with rain shower", "Private step-out balcony with courtyard views", "Smart TV & high-speed Wi-Fi", "Custom tea & coffee brewing bar", "24-hour room service & turndown service"]'::jsonb,
    '["500 Sq Ft", "Max 3 Adults & 2 Children", "Courtyard View", "Dark Marble Bath"]'::jsonb,
    'available',
    true
),
(
    '22222222-2222-2222-2222-222222222201',
    '',
    'Royal Heritage Suite',
    'Royal Heritage',
    'royal-heritage-suite',
    'The Royal Heritage Suite embodies regal Indian hospitality in an expansive 700 sq ft layout accommodating up to 4 adults and 3 children. Features a dedicated lounge seating area, hand-carved headboard, dark marble bath chamber, and a private balcony overlooking the hills.',
    28000.00,
    7,
    4,
    3,
    700,
    'Royal King Bed',
    'Rolling Green Hills & Sunrise Valley',
    '/images/royal-palace-suite.jpg',
    '["/images/royal-palace-suite.jpg", "/images/bedroom.jpg", "/images/bathroom.jpg", "/images/balcony.jpg"]'::jsonb,
    '["Royal King-size bed with premium linens", "Spacious living lounge with marble coffee table", "Dark grey marble bathroom with dual rainfall showers", "Expansive private balcony with outdoor seating", "Nespresso coffee machine & mini-bar", "Dedicated 24/7 butler assistance"]'::jsonb,
    '["700 Sq Ft", "Max 4 Adults & 3 Children", "Private Lounge", "Panoramic Terrace"]'::jsonb,
    'available',
    true
)
ON CONFLICT (id) DO UPDATE SET
    room_number = EXCLUDED.room_number,
    room_name = EXCLUDED.room_name,
    price_per_night = EXCLUDED.price_per_night,
    size_sq_ft = EXCLUDED.size_sq_ft,
    max_adults = EXCLUDED.max_adults,
    max_children = EXCLUDED.max_children,
    max_guests = EXCLUDED.max_guests,
    availability_status = EXCLUDED.availability_status;
