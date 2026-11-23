"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ROOMS_DATA } from "@/data/rooms";
import RoomCard from "./RoomCard";
import { ArrowRight } from "lucide-react";
import { fetchRooms } from "@/lib/bookingService";

export default function RoomsSection() {
  const [rooms, setRooms] = useState(ROOMS_DATA);

  useEffect(() => {
    async function loadRooms() {
      try {
        const data = await fetchRooms();
        if (data && data.length > 0) {
          setRooms(data);
        }
      } catch (err) {
        console.error("Error fetching rooms for homepage:", err);
      }
    }
    loadRooms();
  }, []);

  return (
    <section id="rooms-section" className="py-24 bg-cream-muted text-charcoal relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-sandstone font-semibold block mb-2">
              ACCOMMODATIONS
            </span>
            <h2 className="text-2xl sm:text-5xl font-serif text-charcoal tracking-tight">
              LUXURY ROOMS & SUITES
            </h2>
            <div className="w-16 sm:w-20 h-0.5 bg-gold mt-2 sm:mt-3" />
          </div>

          <p className="text-base font-serif italic text-charcoal/70 max-w-md mt-4 md:mt-0">
            &ldquo;Crafted with best quality marble, handcrafted teak, and expansive views of the surrounding green hills.&rdquo;
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
    </section>
  );
}
