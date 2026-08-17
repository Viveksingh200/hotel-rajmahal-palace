"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function BathroomSection() {
  return (
    <section id="bathroom" className="py-24 bg-charcoal text-cream relative overflow-hidden">
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
            <span className="text-xs uppercase tracking-[0.35em] text-gold font-medium block">
              EN-SUITE SANCTUARY
            </span>

            <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
              CHARCOAL MARBLE BATH
            </h2>

            <div className="w-20 h-0.5 bg-gold" />

            <p className="text-lg font-serif italic text-gold/90">
              &ldquo;Simple, comfortable spaces for a relaxing stay.&rdquo;
            </p>

            <p className="text-base text-cream/80 leading-relaxed font-sans font-light">
              Crafted in striking dark grey marble wall tiles and seamless stone floors, the en-suite bathroom is designed for crisp refreshing comfort. Equipped with a glass rain shower, elegant wash basin, framed mirror, and private window letting in gentle natural light.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs tracking-wider text-cream/90 font-serif">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                <span>Dark Grey Marble Tiles</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                <span>Glass Rainfall Shower</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                <span>Polished Basin & Mirror</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                <span>Artisanal Botanical Amenities</span>
              </div>
            </div>
          </motion.div>

          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 relative h-[450px] sm:h-[520px] rounded-lg overflow-hidden border border-gold/30 shadow-2xl group"
          >
            <Image
              src="/images/bathroom.jpg"
              alt="Dark Grey Marble Bathroom En-Suite"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
