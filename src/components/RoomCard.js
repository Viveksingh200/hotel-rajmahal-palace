"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, BedDouble, Maximize2, ArrowRight, Calendar } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import { motion } from "framer-motion";

export default function RoomCard({ room }) {
  const { startBookingForRoom } = useBooking();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-lg overflow-hidden border border-sandstone/15 shadow-md hover:shadow-2xl hover:border-gold/40 transition-all duration-300 flex flex-col group"
    >
      {/* Image Container */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden">
        <Image
          src={room.featuredImage}
          alt={room.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Price Tag Badge */}
        <div className="absolute top-4 right-4 bg-charcoal/90 backdrop-blur-md text-cream px-4 py-1.5 rounded-sm border border-gold/40 shadow-lg">
          <span className="text-xs uppercase tracking-wider text-gold block">Per Night</span>
          <span className="text-lg font-serif text-white font-semibold">
            {room.currency}{room.pricePerNight}
          </span>
        </div>

        {/* View Highlights */}
        <div className="absolute bottom-3 left-4">
          <span className="text-xs font-serif text-gold tracking-widest uppercase bg-black/50 px-2.5 py-1 rounded-sm backdrop-blur-sm border border-white/10">
            {room.view}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-grow flex flex-col justify-between space-y-5">
        <div>
          <h3 className="text-2xl font-serif text-charcoal group-hover:text-sandstone transition-colors mb-2">
            {room.name}
          </h3>
          <p className="text-xs font-serif italic text-sandstone/90 mb-3">{room.tagline}</p>
          <p className="text-sm text-charcoal/70 line-clamp-2 mb-4 font-sans">{room.description}</p>

          {/* Quick Specs */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-sandstone/10 text-xs text-charcoal/80 font-medium">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-gold" />
              <span>{room.maxGuests} Guests</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-4 h-4 text-gold" />
              <span className="truncate">{room.bedType.split(" ")[0]} Bed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-gold" />
              <span>{room.sizeSqFt} Sq Ft</span>
            </div>
          </div>
        </div>

        {/* Amenities Pills */}
        <div className="flex flex-wrap gap-1.5">
          {room.highlights.slice(0, 3).map((item, idx) => (
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
            href={`/rooms/${room.slug}`}
            className="w-full bg-cream-muted hover:bg-cream-dark text-charcoal font-serif text-xs tracking-wider uppercase py-2.5 rounded-sm border border-sandstone/20 text-center flex items-center justify-center gap-1 transition-colors"
          >
            <span>VIEW ROOM</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => startBookingForRoom(room)}
            className="w-full bg-sandstone hover:bg-sandstone-dark text-cream font-serif text-xs tracking-wider uppercase py-2.5 rounded-sm border border-gold/40 text-center flex items-center justify-center gap-1 shadow-md hover:shadow-sandstone/40 transition-all"
          >
            <Calendar className="w-3.5 h-3.5 text-gold" />
            <span>BOOK NOW</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
