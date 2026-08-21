"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, BedDouble, Maximize2, ArrowRight, Calendar, Lock } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import { motion } from "framer-motion";

export default function RoomCard({ room }) {
  const { startBookingForRoom } = useBooking();

  // Normalize properties from either Supabase DB schema or local static JS schema
  const roomName = room.room_name || room.name;
  const price = room.price_per_night !== undefined ? room.price_per_night : room.pricePerNight;
  const currency = room.currency || "₹";
  const view = room.view_type || room.view;
  const size = room.size_sq_ft || room.sizeSqFt;
  const bed = room.bed_type || room.bedType || "Heritage Bed";
  const guests = room.max_guests || room.maxGuests || 2;
  const image = room.image_url || room.featuredImage || "/images/heritage-deluxe-room.jpg";
  const slug = room.slug || room.id;
  const tagline = room.tagline || room.description;
  const status = (room.availability_status || room.availabilityStatus || "available").toLowerCase();
  const isAvailable = status === "available" && room.is_active !== false;

  const normalizedRoom = {
    ...room,
    id: room.id,
    slug: slug,
    name: roomName,
    pricePerNight: price,
    currency: currency,
    sizeSqFt: size,
    maxGuests: guests,
    bedType: bed,
    view: view,
    featuredImage: image,
    description: room.description,
    amenities: room.amenities || [],
    highlights: room.highlights || [],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`bg-white rounded-lg overflow-hidden border transition-all duration-300 flex flex-col group ${
        isAvailable
          ? "border-sandstone/15 shadow-md hover:shadow-2xl hover:border-gold/40"
          : "border-red-900/20 bg-stone-50 opacity-90"
      }`}
    >
      {/* Image Container */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden">
        <Image
          src={image}
          alt={roomName}
          fill
          className={`object-cover transition-transform duration-700 ${
            isAvailable ? "group-hover:scale-105" : "grayscale-[40%]"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Status Badge */}
        {!isAvailable && (
          <div className="absolute top-4 left-4 bg-red-900/90 text-white font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-sm border border-red-500/40 shadow-lg flex items-center gap-1.5 z-10">
            <Lock className="w-3 h-3 text-red-300" />
            <span>{status === "maintenance" ? "Under Maintenance" : "Unavailable"}</span>
          </div>
        )}

        {/* Price Tag Badge */}
        <div className="absolute top-4 right-4 bg-charcoal/90 backdrop-blur-md text-cream px-4 py-1.5 rounded-sm border border-gold/40 shadow-lg">
          <span className="text-xs uppercase tracking-wider text-gold block">Per Night</span>
          <span className="text-lg font-serif text-white font-semibold">
            {currency}{Number(price).toLocaleString("en-IN")}
          </span>
        </div>

        {/* View Highlights */}
        <div className="absolute bottom-3 left-4">
          <span className="text-xs font-serif text-gold tracking-widest uppercase bg-black/50 px-2.5 py-1 rounded-sm backdrop-blur-sm border border-white/10">
            {view}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-grow flex flex-col justify-between space-y-5">
        <div>
          <h3 className="text-2xl font-serif text-charcoal group-hover:text-sandstone transition-colors mb-2">
            {roomName}
          </h3>
          <p className="text-xs font-serif italic text-sandstone/90 mb-3">{tagline}</p>
          <p className="text-sm text-charcoal/70 line-clamp-2 mb-4 font-sans">{room.description}</p>

          {/* Quick Specs */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-sandstone/10 text-xs text-charcoal/80 font-medium">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-gold" />
              <span>{guests} Guests</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-4 h-4 text-gold" />
              <span className="truncate">{String(bed).split(" ")[0]} Bed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-gold" />
              <span>{size} Sq Ft</span>
            </div>
          </div>
        </div>

        {/* Amenities Pills */}
        <div className="flex flex-wrap gap-1.5">
          {Array.isArray(room.highlights) &&
            room.highlights.slice(0, 3).map((item, idx) => (
              <span
                key={idx}
                className="text-[11px] bg-cream-muted text-charcoal/80 px-2.5 py-1 rounded-sm border border-sandstone/10 font-sans"
              >
                {item}
              </span>
            ))}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Link
            href={`/rooms/${slug}`}
            className="w-full bg-cream-muted hover:bg-cream-dark text-charcoal font-serif text-xs tracking-wider uppercase py-2.5 rounded-sm border border-sandstone/20 text-center flex items-center justify-center gap-1 transition-colors"
          >
            <span>VIEW ROOM</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {isAvailable ? (
            <button
              onClick={() => startBookingForRoom(normalizedRoom)}
              className="w-full bg-sandstone hover:bg-sandstone-dark text-cream font-serif text-xs tracking-wider uppercase py-2.5 rounded-sm border border-gold/40 text-center flex items-center justify-center gap-1 shadow-md hover:shadow-sandstone/40 transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-gold" />
              <span>BOOK NOW</span>
            </button>
          ) : (
            <button
              disabled
              className="w-full bg-stone-200 text-stone-500 font-serif text-xs tracking-wider uppercase py-2.5 rounded-sm border border-stone-300 text-center flex items-center justify-center gap-1 cursor-not-allowed opacity-75"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{status === "maintenance" ? "MAINTENANCE" : "UNAVAILABLE"}</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
