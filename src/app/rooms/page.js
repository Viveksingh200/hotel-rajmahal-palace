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
    <div className="w-full bg-cream text-charcoal pb-20">
      {/* Subpage Banner Header */}
      <div className="relative h-[320px] sm:h-[420px] w-full flex items-center justify-center text-center overflow-hidden mb-12">
        <Image
          src="/images/rooms.png"
          alt="Luxury Heritage Rooms Header"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-cream space-y-3 pt-14">
          <span className="text-xs uppercase tracking-[0.4em] text-gold font-medium block">
            ACCOMMODATIONS
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif text-white tracking-tight">
            Rooms & Royal Suites
          </h1>
          <div className="w-20 h-0.5 bg-gold mx-auto" />
          <p className="text-base sm:text-lg font-serif italic text-[#D4AF37] max-w-xl mx-auto bg-[#100F0E]/60 py-1 px-2 rounded-full">
            &ldquo;Designed with dark grey marble, handcrafted teak, and private balcony terraces overlooking misty green hills.&rdquo;
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BookingWidget />

        <div className="mt-16 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-serif text-charcoal">Select Your Preferred Sanctuary</h2>
            <p className="text-sm text-charcoal/70 mt-1 font-sans">
              Choose from our distinctive heritage room categories tailored for tranquil hill stays.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
