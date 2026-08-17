"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ROOMS_DATA } from "@/data/rooms";
import { useBooking } from "@/context/BookingContext";
import { Users, BedDouble, Maximize2, Calendar, Check, ArrowLeft, Shield, Sparkles } from "lucide-react";
import GalleryLightbox from "@/components/GalleryLightbox";

export default function RoomDetailPage({ params }) {
  // Unwrap Next.js 16 params promise
  const resolvedParams = use(params);
  const room = ROOMS_DATA.find((r) => r.slug === resolvedParams.slug);

  if (!room) {
    notFound();
  }

  const {
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    guests,
    setGuests,
    roomsCount,
    setRoomsCount,
    startBookingForRoom,
    nights,
  } = useBooking();

  const [activeImage, setActiveImage] = useState(room.featuredImage);

  // Price calculations in frontend JS
  const subtotal = room.pricePerNight * nights * roomsCount;
  const taxes = Math.round(subtotal * 0.12);
  const estimatedTotal = subtotal + taxes;

  return (
    <div className="w-full bg-cream text-charcoal pt-24 pb-20">
      {/* Top Back Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <Link
          href="/rooms"
          className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-widest text-sandstone hover:text-sandstone-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Rooms</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Left Content: Gallery & Details */}
          <div className="lg:col-span-8 space-y-8">
            {/* Main Featured Image */}
            <div className="relative h-[400px] sm:h-[500px] rounded-lg overflow-hidden border border-sandstone/20 shadow-xl">
              <Image
                src={activeImage}
                alt={room.name}
                fill
                priority
                className="object-cover transition-all duration-500"
              />
              <div className="absolute top-4 left-4 bg-charcoal/80 text-gold px-3.5 py-1.5 rounded-sm border border-gold/30 backdrop-blur-md text-xs font-serif tracking-widest uppercase">
                {room.view}
              </div>
            </div>

            {/* Gallery Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {room.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative h-20 sm:h-24 rounded overflow-hidden border-2 transition-all ${
                    activeImage === img ? "border-sandstone scale-95 shadow-md" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`Gallery thumbnail ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>

            {/* Room Titles & Overview */}
            <div className="space-y-4 pt-4 border-t border-sandstone/15">
              <span className="text-xs uppercase tracking-[0.35em] text-sandstone font-semibold">
                HERITAGE ACCOMMODATION
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif text-charcoal tracking-tight">
                {room.name}
              </h1>
              <p className="text-base font-serif italic text-sandstone">{room.tagline}</p>
              <div className="w-20 h-0.5 bg-gold" />
              <p className="text-base text-charcoal/80 leading-relaxed font-sans font-light">
                {room.description}
              </p>
            </div>

            {/* Room Specs Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-lg bg-cream-muted border border-sandstone/15 text-charcoal text-center">
              <div>
                <span className="text-xs text-charcoal/60 block font-serif uppercase">Capacity</span>
                <span className="text-base font-serif font-bold text-sandstone flex items-center justify-center gap-1 mt-1">
                  <Users className="w-4 h-4" />
                  {room.maxGuests} Guests
                </span>
              </div>
              <div>
                <span className="text-xs text-charcoal/60 block font-serif uppercase">Bedding</span>
                <span className="text-base font-serif font-bold text-sandstone flex items-center justify-center gap-1 mt-1">
                  <BedDouble className="w-4 h-4" />
                  {room.bedType}
                </span>
              </div>
              <div>
                <span className="text-xs text-charcoal/60 block font-serif uppercase">Room Size</span>
                <span className="text-base font-serif font-bold text-sandstone flex items-center justify-center gap-1 mt-1">
                  <Maximize2 className="w-4 h-4" />
                  {room.sizeSqFt} Sq Ft
                </span>
              </div>
              <div>
                <span className="text-xs text-charcoal/60 block font-serif uppercase">Primary View</span>
                <span className="text-xs font-serif font-bold text-sandstone block mt-2 truncate">
                  {room.view}
                </span>
              </div>
            </div>

            {/* Amenities List */}
            <div className="space-y-4 pt-4 border-t border-sandstone/15">
              <h3 className="text-2xl font-serif text-charcoal">Suite Amenities & Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {room.amenities.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-sm text-charcoal/80 font-sans">
                    <div className="w-5 h-5 rounded-full bg-sandstone/15 text-sandstone flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Right Booking Calculation Panel */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-charcoal text-cream rounded-lg p-6 border border-gold/40 shadow-2xl space-y-6">
              <div className="border-b border-white/10 pb-4">
                <span className="text-xs uppercase tracking-widest text-gold font-serif block">
                  NIGHTLY RATE
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-serif text-white font-bold">
                    {room.currency}{room.pricePerNight}
                  </span>
                  <span className="text-xs text-cream/70">/ night</span>
                </div>
              </div>

              {/* Dynamic Frontend Booking Form */}
              <div className="space-y-4 text-xs">
                <div className="flex flex-col space-y-1">
                  <label className="text-gold font-serif uppercase tracking-wider">Check-In</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="bg-charcoal-light border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-gold font-serif uppercase tracking-wider">Check-Out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="bg-charcoal-light border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col space-y-1">
                    <label className="text-gold font-serif uppercase tracking-wider">Guests</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="bg-charcoal-light border border-white/20 rounded px-2.5 py-2 text-white text-sm focus:outline-none focus:border-gold"
                    >
                      <option value={1}>1 Guest</option>
                      <option value={2}>2 Guests</option>
                      <option value={3}>3 Guests</option>
                    </select>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-gold font-serif uppercase tracking-wider">Rooms</label>
                    <select
                      value={roomsCount}
                      onChange={(e) => setRoomsCount(Number(e.target.value))}
                      className="bg-charcoal-light border border-white/20 rounded px-2.5 py-2 text-white text-sm focus:outline-none focus:border-gold"
                    >
                      <option value={1}>1 Room</option>
                      <option value={2}>2 Rooms</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Price Calculation Summary (Frontend JS) */}
              <div className="bg-charcoal-light p-4 rounded border border-white/10 space-y-2 text-xs font-sans">
                <div className="flex justify-between">
                  <span className="text-cream/70">Nights</span>
                  <span className="font-mono text-white">{nights} Night(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream/70">Subtotal ({nights} × ${room.pricePerNight})</span>
                  <span className="font-mono text-white">${subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream/70">Heritage Tax (12%)</span>
                  <span className="font-mono text-white">${taxes}</span>
                </div>
                <div className="w-full h-px bg-white/10 my-1" />
                <div className="flex justify-between font-serif text-sm text-gold font-bold">
                  <span>ESTIMATED TOTAL</span>
                  <span className="font-mono text-base text-white">${estimatedTotal}</span>
                </div>
              </div>

              {/* Reserve Button */}
              <button
                onClick={() => startBookingForRoom(room)}
                className="w-full bg-sandstone hover:bg-sandstone-dark text-cream font-serif text-xs tracking-widest uppercase py-4 rounded border border-gold/40 shadow-xl flex items-center justify-center gap-2 transition-all"
              >
                <Calendar className="w-4 h-4 text-gold" />
                <span>BOOK THIS SUITE NOW</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-cream/60">
                <Shield className="w-3.5 h-3.5 text-gold" />
                <span>Best Rate Guarantee • Instant Confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
