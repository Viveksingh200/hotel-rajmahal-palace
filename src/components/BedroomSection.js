"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function BedroomSection() {
  return (
    <section id="bedroom" className="py-24 bg-cream-muted text-charcoal relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 relative h-[450px] sm:h-[520px] rounded-lg overflow-hidden border border-sandstone/20 shadow-xl group"
          >
            <Image
              src="/images/bedroom.jpg"
              alt="Luxury Heritage Bedroom with Teak Wood Bed and Dark Marble Flooring"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent pointer-events-none" />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 space-y-6"
          >
            <span className="text-xs uppercase tracking-[0.35em] text-sandstone font-semibold block">
              HERITAGE BEDROOM SUITE
            </span>

            <h2 className="text-3xl sm:text-5xl font-serif text-charcoal tracking-tight">
              PEACEFUL HERITAGE REST
            </h2>

            <div className="w-20 h-0.5 bg-gold" />

            <p className="text-base text-charcoal/80 leading-relaxed font-sans">
              Each bedroom suite at Hotel Rajmahal Palace is thoughtfully curated with solid teak wooden beds, warm earth-toned brown textiles, and polished dark marble floors that keep the room pleasantly cool throughout the sunny mountain day.
            </p>

            <ul className="space-y-3 pt-2 text-sm text-charcoal font-serif">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-sandstone" />
                <span>Custom teak wood king bed with plush hand-loomed linens</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-sandstone" />
                <span>Polished dark grey marble flooring and cream walls</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-sandstone" />
                <span>Large sunlit windows with direct step-out balcony access</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-sandstone" />
                <span>Warm ambient lamp lighting for tranquil evening reading</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
