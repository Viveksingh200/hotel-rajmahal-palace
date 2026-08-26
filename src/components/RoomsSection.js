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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <span className="text-xs uppercase tracking-[0.35em] text-sandstone font-semibold block mb-2">
              ACCOMMODATIONS
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-charcoal tracking-tight">
              LUXURY ROOMS & SUITES
            </h2>
            <div className="w-20 h-0.5 bg-gold mt-3" />
          </div>

          <p className="text-base font-serif italic text-charcoal/70 max-w-md mt-4 md:mt-0">
            &ldquo;Crafted with best quality marble, handcrafted teak, and expansive views of the surrounding green hills.&rdquo;
          </p>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/rooms"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-sandstone hover:bg-sandstone-dark text-cream font-serif text-xs tracking-widest uppercase rounded-sm border border-gold/40 shadow-lg transition-all group"
          >
            <span>EXPLORE ALL SUITES</span>
            <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
