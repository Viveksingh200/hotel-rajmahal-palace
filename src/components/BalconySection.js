"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function BalconySection() {
  return (
    <section id="balcony" className="py-24 bg-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 relative h-[450px] sm:h-[550px] rounded-lg overflow-hidden border border-sandstone/20 shadow-xl group"
          >
            <Image
              src="/images/bhimashankar-tourist-places.avif"
              alt="Scenic Hills and Lake Views of Bhimashankar"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-4 left-4 bg-charcoal/80 backdrop-blur-md px-3.5 py-1.5 rounded-sm border border-gold/30">
              <span className="text-xs font-serif text-gold tracking-widest uppercase">
                LAKES & HILLS
              </span>
            </div>
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 space-y-6"
          >
            <span className="text-xs uppercase tracking-[0.35em] text-sandstone font-semibold block">
              SIGHTSEEING & NATURE
            </span>

            <h2 className="text-3xl sm:text-5xl font-serif text-charcoal tracking-tight">
              Beautiful Hills & Lakes
            </h2>

            <div className="w-20 h-0.5 bg-gold" />

            <p className="text-lg font-serif italic text-sandstone">
              &ldquo;Enjoy calm lakes, green hills, and fresh mountain air.&rdquo;
            </p>

            <p className="text-base text-charcoal/80 leading-relaxed font-sans">
              Explore the best places around Bhimashankar. Visit peaceful lakes, enjoy scenic mountain viewpoints, and take relaxing nature walks during your stay.
            </p>

            <div className="p-4 rounded-md bg-cream-muted border border-sandstone/15 text-sm text-charcoal/80 space-y-2">
              <div className="flex items-center gap-2 text-sandstone font-serif font-medium">
                <span>✦ Popular Tourist Spots Nearby</span>
              </div>
              <p className="text-xs">
                Great for family sightseeing, nature photography, and peaceful morning walks.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
