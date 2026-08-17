"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Compass, ChevronDown } from "lucide-react";
import { useBooking } from "@/context/BookingContext";

export default function Hero() {
  const { openBookingModal } = useBooking();

  const scrollToExplore = () => {
    const el = document.getElementById("hotel-intro");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
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
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-cream mt-16 sm:mt-0">
        {/* Sub-badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-sandstone/30 border border-gold/40 backdrop-blur-md mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
          <span className="text-xs uppercase tracking-[0.35em] text-gold font-medium">
            A STAY BEYOND ORDINARY
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-tight text-white mb-4 drop-shadow-md leading-tight"
        >
          Hotel Rajmahal Palace
        </motion.h1>

        {/* Jali Motif Accent Line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-32 h-0.5 mx-auto bg-gradient-to-r from-transparent via-gold to-transparent mb-6"
        />

        {/* Subtitle / Quote */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-lg sm:text-2xl font-serif italic text-cream/90 max-w-2xl mx-auto mb-10 drop-shadow"
        >
          &ldquo;Where heritage meets the serenity of the hills.&rdquo;
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <button
            onClick={() => openBookingModal("available")}
            className="w-full sm:w-auto bg-sandstone hover:bg-sandstone-dark text-cream font-serif text-sm tracking-widest px-8 py-4 rounded-sm border border-gold/50 hover:border-gold shadow-2xl hover:shadow-sandstone/50 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <Calendar className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
            <span>BOOK YOUR STAY</span>
          </button>

          <button
            onClick={scrollToExplore}
            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-cream font-serif text-sm tracking-widest px-8 py-4 rounded-sm border border-white/30 hover:border-gold backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2 group"
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
