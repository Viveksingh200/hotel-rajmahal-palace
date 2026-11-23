"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Compass, ChevronDown } from "lucide-react";

export default function Hero() {

  const scrollToExplore = () => {
    const el = document.getElementById("hotel-intro");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full h-screen min-h-[580px] sm:min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Ambient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-exterior.jpg"
          alt="Hotel Rajmahal Palace Exterior & Surrounding Hills"
          fill
          priority
          quality={95}
          className="object-cover object-center scale-105 animate-pulse-subtle transition-transform duration-10000"
        />
        {/* Layered luxury gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/70" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-cream pt-20 pb-16 sm:py-0 mt-6 sm:mt-0">
        {/* Sub-badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 sm:gap-3 px-3.5 py-1.5 rounded-full bg-sandstone/30 border border-gold/40 backdrop-blur-md mb-4 sm:mb-6"
        >
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gold animate-ping" />
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-gold font-medium">
            A STAY BEYOND ORDINARY
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="text-3xl sm:text-6xl md:text-7xl font-serif tracking-tight text-white mb-3 sm:mb-4 drop-shadow-md leading-tight"
        >
          Hotel Rajmahal Palace
        </motion.h1>

        {/* Jali Motif Accent Line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-24 sm:w-32 h-0.5 mx-auto bg-gradient-to-r from-transparent via-gold to-transparent mb-5 sm:mb-6"
        />

        {/* Subtitle / Quote */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-base sm:text-2xl font-serif italic text-cream/90 max-w-2xl mx-auto mb-8 sm:mb-10 drop-shadow"
        >
          &ldquo;Where heritage meets the serenity of the hills.&rdquo;
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6"
        >
          <Link
            href="/rooms"
            className="w-full sm:w-auto bg-gradient-to-r from-[#C9A86A] via-[#D4AF37] to-[#C9A86A] text-[#100F0E] font-serif text-xs sm:text-sm font-bold tracking-widest px-6 py-3.5 sm:px-8 sm:py-4 rounded-sm border border-gold/50 shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_45px_rgba(212,175,55,0.6)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#100F0E] group-hover:scale-110 transition-transform" />
            <span>RESERVE YOUR STAY</span>
          </Link>

          <button
            onClick={scrollToExplore}
            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-cream font-serif text-xs sm:text-sm tracking-widest px-6 py-3.5 sm:px-8 sm:py-4 rounded-sm border border-white/30 hover:border-gold backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Compass className="w-4 h-4 text-gold group-hover:rotate-45 transition-transform" />
            <span>EXPLORE THE HOTEL</span>
          </button>
        </motion.div>
      </div>

      {/* Down Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        onClick={scrollToExplore}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-cream/70 hover:text-gold transition-colors focus:outline-none"
        aria-label="Scroll down"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <ChevronDown className="w-5 h-5 animate-bounce text-gold" />
      </motion.button>
    </section>
  );
}
