"use client";

import React from "react";
import Link from "next/link";
import { ROOMS_DATA } from "@/data/rooms";
import RoomCard from "./RoomCard";
import { ArrowRight } from "lucide-react";

export default function RoomsSection() {
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
            &ldquo;Crafted with dark marble, handcrafted teak, and expansive views of the surrounding green hills.&rdquo;
          </p>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ROOMS_DATA.slice(0, 3).map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/rooms"
            className="inline-flex items-center gap-3 bg-charcoal hover:bg-black text-cream font-serif text-sm tracking-widest uppercase px-8 py-4 rounded-sm border border-gold/40 hover:border-gold shadow-xl transition-all duration-300 group"
          >
            <span>VIEW ALL ACCOMMODATIONS</span>
            <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
