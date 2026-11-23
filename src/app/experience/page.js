"use client";

import React from "react";
import Image from "next/image";
import ExperienceSection from "@/components/ExperienceSection";
import BalconySection from "@/components/BalconySection";

export default function ExperiencePage() {
  return (
    <div className="w-full bg-cream text-charcoal pb-20">
      {/* Subpage Banner Header */}
      <div className="relative min-h-[320px] sm:h-[420px] w-full flex flex-col items-center justify-center text-center overflow-hidden pt-24 sm:pt-28 pb-8 sm:pb-12 px-3 sm:px-4">
        <Image
          src="/images/1474910833_bhimshankar_7.jpg"
          alt="Serene Hill Surroundings of Hotel Rajmahal Palace"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/45 to-black/60 sm:to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-2 sm:px-4 text-cream space-y-2.5 sm:space-y-3">
          <span className="text-[9.5px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.4em] text-gold font-medium block">
            NATURE & PEACE
          </span>
          <h1 className="text-2xl sm:text-6xl font-serif text-white tracking-tight">
            Experience & Nature
          </h1>
          <div className="w-12 sm:w-20 h-0.5 bg-gold mx-auto" />
          <p className="text-xs sm:text-lg font-serif italic text-[#D4AF37] max-w-xl mx-auto bg-[#100F0E]/80 py-1.5 px-3 sm:px-4 rounded-xl sm:rounded-full">
            &ldquo;Enjoy fresh air, lush green hills, and peaceful mountain views.&rdquo;
          </p>
        </div>
      </div>

      <ExperienceSection />
      <BalconySection />
    </div>
  );
}
