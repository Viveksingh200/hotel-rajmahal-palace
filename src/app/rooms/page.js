"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ROOMS_DATA } from "@/data/rooms";
import RoomCard from "@/components/RoomCard";
import BookingWidget from "@/components/BookingWidget";
import { fetchRooms } from "@/lib/bookingService";

export default function RoomsPage() {
  const [rooms, setRooms] = useState(ROOMS_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRooms() {
      try {
        const data = await fetchRooms();
        if (data && data.length > 0) {
          setRooms(data);
        }
      } catch (err) {
        console.error("Error loading rooms from Supabase:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRooms();
  }, []);

  return (
    <div className="w-full bg-cream text-charcoal pb-16 sm:pb-24">
      {/* Subpage Banner Header */}
      <div className="relative min-h-[300px] sm:h-[420px] w-full flex items-center justify-center text-center overflow-hidden mb-8 sm:mb-12 pt-16 pb-10 px-4">
        <Image
          src="/images/rooms.png"
          alt="Luxury Heritage Rooms Header"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/40 to-black/60 sm:to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-2 sm:px-4 text-cream space-y-3 sm:space-y-4">
          <span className="text-[10.5px] sm:text-xs uppercase tracking-[0.35em] sm:tracking-[0.4em] text-gold font-medium block">
            ACCOMMODATIONS
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-white tracking-tight leading-tight">
            Rooms & Royal Suites
          </h1>
          <div className="w-16 sm:w-20 h-0.5 bg-gold mx-auto" />
          <p className="text-xs sm:text-base font-serif italic text-[#D4AF37] max-w-xl mx-auto bg-[#100F0E]/75 py-2 px-3 sm:px-5 rounded-xl sm:rounded-full border border-[#D4AF37]/20 leading-relaxed shadow-lg">
            &ldquo;Designed with dark grey marble, handcrafted teak, and private balcony terraces overlooking misty green hills.&rdquo;
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <BookingWidget />

        <div className="mt-10 sm:mt-16 space-y-6 sm:space-y-8">
          <div className="text-center max-w-2xl mx-auto px-2">
            <h2 className="text-2xl sm:text-3xl font-serif text-charcoal">Select Your Preferred Sanctuary</h2>
            <p className="text-xs sm:text-sm text-charcoal/70 mt-1.5 font-sans">
              Choose from our distinctive heritage room categories tailored for tranquil hill stays.
            </p>
          </div>

          {/* Single Full-Width Room Card (1 Card representing all 8 identical Heritage Deluxe Rooms) */}
          <div className="w-full max-w-5xl mx-auto">
            {rooms && rooms.length > 0 ? (
              <RoomCard room={rooms[0]} />
            ) : (
              <RoomCard room={ROOMS_DATA[0]} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
