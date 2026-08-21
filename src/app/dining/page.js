"use client";

import React from "react";
import Image from "next/image";
import DiningSection from "@/components/DiningSection";

export default function DiningPage() {
  return (
    <div className="w-full bg-cream text-charcoal pb-20">
      {/* Banner */}
      <div className="relative h-[320px] sm:h-[420px] w-full flex items-center justify-center text-center overflow-hidden">
        <Image
          src="/images/dining.png"
          alt="Palace Courtyard Dining"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-cream space-y-3 pt-14">
          <span className="text-xs uppercase tracking-[0.4em] text-gold font-medium block">
            ROYAL CUISINE
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif text-white tracking-tight">
            Palace Dining
          </h1>
          <div className="w-20 h-0.5 bg-gold mx-auto" />
          <p className="text-base sm:text-lg font-serif italic text-[#D4AF37] max-w-xl mx-auto bg-[#100F0E]/80 py-1 px-2 rounded-full">
            &ldquo;Enjoy relaxed dining in a warm and welcoming setting.&rdquo;
          </p>
        </div>
      </div>

      <DiningSection />
    </div>
  );
}
