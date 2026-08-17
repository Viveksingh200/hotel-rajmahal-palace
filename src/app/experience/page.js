"use client";

import React from "react";
import Image from "next/image";
import ExperienceSection from "@/components/ExperienceSection";
import BalconySection from "@/components/BalconySection";

export default function ExperiencePage() {
  return (
    <div className="w-full bg-cream text-charcoal pt-24 pb-20">
      {/* Subpage Banner Header */}
      <div className="relative h-[380px] w-full flex items-center justify-center text-center overflow-hidden mb-12">
        <Image
          src="/images/experience.jpg"
          alt="Serene Hill Surroundings of Hotel Rajmahal Palace"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-black/60" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-cream space-y-3">
          <span className="text-xs uppercase tracking-[0.4em] text-gold font-medium block">
            THE HILL ESCAPE
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif text-white tracking-tight">
            Experience & Nature
          </h1>
          <div className="w-20 h-0.5 bg-gold mx-auto" />
          <p className="text-base sm:text-lg font-serif italic text-cream/90 max-w-xl mx-auto">
            &ldquo;Surrounded by green ridges, crisp air, and tranquil mountain horizons.&rdquo;
          </p>
        </div>
      </div>

      <ExperienceSection />
      <BalconySection />
    </div>
  );
}
