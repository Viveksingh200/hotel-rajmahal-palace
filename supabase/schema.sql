-- =========================================================
-- Hotel Rajmahal Palace — Database Schema
-- Supabase PostgreSQL with Row Level Security (RLS)
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------
-- 1. ROOMS TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_number TEXT NOT NULL UNIQUE,
    room_name TEXT NOT NULL,
    room_type TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    price_per_night NUMERIC(10, 2) NOT NULL CHECK (price_per_night >= 0),
    max_guests INTEGER NOT NULL DEFAULT 2,
    max_adults INTEGER NOT NULL DEFAULT 2,
    max_children INTEGER NOT NULL DEFAULT 1,
    size_sq_ft INTEGER NOT NULL DEFAULT 400,
    bed_type TEXT DEFAULT 'King Heritage Bed',
    view_type TEXT DEFAULT 'Palace Garden',
    image_url TEXT NOT NULL,
    gallery JSONB DEFAULT '[]'::jsonb,
    amenities JSONB DEFAULT '[]'::jsonb,
    highlights JSONB DEFAULT '[]'::jsonb,
    availability_status TEXT NOT NULL DEFAULT 'available' CHECK (availability_status IN ('available', 'unavailable', 'maintenance')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ---------------------------------------------------------
-- 2. BOOKINGS TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    special_requests TEXT,
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE RESTRICT,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL CHECK (check_out > check_in),
    guests INTEGER NOT NULL DEFAULT 1 CHECK (guests > 0),
    rooms_count INTEGER NOT NULL DEFAULT 1 CHECK (rooms_count > 0),
    nights INTEGER NOT NULL DEFAULT 1 CHECK (nights > 0),
    room_subtotal NUMERIC(10, 2) NOT NULL CHECK (room_subtotal >= 0),
    taxes_and_fees NUMERIC(10, 2) NOT NULL CHECK (taxes_and_fees >= 0),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    booking_status TEXT NOT NULL DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ---------------------------------------------------------
-- 3. ADMIN USERS TABLE (Role-Based Access)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('owner', 'admin', 'manager')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ---------------------------------------------------------
-- 4. INDEXES FOR HIGH PERFORMANCE
-- ---------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_rooms_availability ON public.rooms(availability_status, is_active);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings(room_id, check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(booking_status, payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON public.bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_razorpay_order ON public.bookings(razorpay_order_id);

-- ---------------------------------------------------------
-- 5. TRIGGER FOR UPDATED_AT TIMESTAMP
-- ---------------------------------------------------------
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = timezone('utc'::text, now());
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_rooms_updated_at ON public.rooms;
CREATE TRIGGER set_rooms_updated_at
BEFORE UPDATE ON public.rooms
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS set_bookings_updated_at ON public.bookings;
CREATE TRIGGER set_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ---------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ---------------------------------------------------------
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ROOMS POLICIES:
-- Public can read active rooms
DROP POLICY IF EXISTS "Public can view active rooms" ON public.rooms;
CREATE POLICY "Public can view active rooms"
ON public.rooms FOR SELECT
USING (is_active = true);

-- Admins can perform all actions on rooms
DROP POLICY IF EXISTS "Admins have full access to rooms" ON public.rooms;
CREATE POLICY "Admins have full access to rooms"
ON public.rooms FOR ALL
USING (public.is_admin());

-- BOOKINGS POLICIES:
-- Public can insert new bookings
DROP POLICY IF EXISTS "Public can create bookings" ON public.bookings;
CREATE POLICY "Public can create bookings"
ON public.bookings FOR INSERT
WITH CHECK (true);

-- Public can view booking by reference (for confirmation voucher)
DROP POLICY IF EXISTS "Public can view booking by reference" ON public.bookings;
CREATE POLICY "Public can view booking by reference"
ON public.bookings FOR SELECT
USING (true);

-- Admins have full access to bookings
DROP POLICY IF EXISTS "Admins have full access to bookings" ON public.bookings;
CREATE POLICY "Admins have full access to bookings"
ON public.bookings FOR ALL
USING (public.is_admin());

-- ADMIN USERS POLICIES:
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
CREATE POLICY "Admins can view admin_users"
ON public.admin_users FOR SELECT
USING (public.is_admin() OR auth.uid() = user_id);

-- ---------------------------------------------------------
-- 7. GRANT PERMISSIONS (Allows API & Service Role Access)
-- ---------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
