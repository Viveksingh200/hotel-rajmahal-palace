"use client";

import React from "react";
import Image from "next/image";
import ExperienceSection from "@/components/ExperienceSection";
import BalconySection from "@/components/BalconySection";

export default function ExperiencePage() {
  return (
    <div className="w-full bg-cream text-charcoal pb-20">
      {/* Subpage Banner Header */}
      <div className="relative h-[320px] sm:h-[420px] w-full flex items-center justify-center text-center overflow-hidden">
        <Image
          src="/images/experience.png"
          alt="Serene Hill Surroundings of Hotel Rajmahal Palace"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-cream space-y-3 pt-14">
          <span className="text-xs uppercase tracking-[0.4em] text-gold font-medium block">
            THE HILL ESCAPE
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif text-white tracking-tight">
            Experience & Nature
          </h1>
          <div className="w-20 h-0.5 bg-gold mx-auto" />
          <p className="text-base sm:text-lg font-serif italic text-[#D4AF37] max-w-xl mx-auto bg-[#100F0E]/80 py-1 px-2 rounded-full">
            &ldquo;Surrounded by green ridges, crisp air, and tranquil mountain horizons.&rdquo;
          </p>
        </div>
      </div>

      <ExperienceSection />
      <BalconySection />
    </div>
  );
}
