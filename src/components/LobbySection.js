"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function LobbySection() {
  return (
    <section id="lobby" className="py-24 bg-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 space-y-6"
          >
            <span className="text-xs uppercase tracking-[0.35em] text-sandstone font-semibold block">
              HERITAGE LOUNGE
            </span>

            <h2 className="text-3xl sm:text-5xl font-serif text-charcoal tracking-tight">
              A WARM WELCOME
            </h2>

            <div className="w-20 h-0.5 bg-gold" />

            <p className="text-lg font-serif italic text-sandstone">
              &ldquo;Relax into the warmth of traditional hospitality.&rdquo;
            </p>

            <p className="text-base text-charcoal/80 leading-relaxed font-sans">
              Bright, airy, and bathed in natural sunlight, our palace lobby blends pristine cream walls with dark marble accents and handcrafted wood lounge seating. Here, complimentary herbal welcome teas are served while your stay is arranged effortlessly.
            </p>

            <div className="p-4 rounded-md bg-cream-muted border-l-4 border-gold text-sm text-charcoal/90 italic font-serif">
              &ldquo;The perfect sanctuary to unwind after a scenic drive through the surrounding hills.&rdquo;
            </div>
          </motion.div>

          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 relative h-[450px] sm:h-[500px] rounded-lg overflow-hidden border border-sandstone/20 shadow-xl"
          >
            <Image
              src="/images/lobby.jpg"
              alt="Bright Warm Palace Lobby and Lounge Corridor"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
