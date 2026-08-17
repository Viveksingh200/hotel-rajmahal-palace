"use client";

import React from "react";
import Image from "next/image";
import GalleryLightbox from "@/components/GalleryLightbox";

export default function GalleryPage() {
  return (
    <div className="w-full bg-cream text-charcoal pt-24 pb-20">
      {/* Banner */}
      <div className="relative h-[350px] w-full flex items-center justify-center text-center overflow-hidden mb-16">
        <Image
          src="/images/hero-exterior.jpg"
          alt="Palace Gallery Header"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-black/60" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-cream space-y-3">
          <span className="text-xs uppercase tracking-[0.4em] text-gold font-medium block">
            VISUAL PORTFOLIO
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif text-white tracking-tight">
            Photo Gallery
          </h1>
          <div className="w-20 h-0.5 bg-gold mx-auto" />
          <p className="text-base sm:text-lg font-serif italic text-cream/90 max-w-xl mx-auto">
            &ldquo;Explore the architecture, suites, balconies, and dining spaces of Hotel Rajmahal Palace.&rdquo;
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GalleryLightbox showFilter={true} />
      </div>
    </div>
  );
}
