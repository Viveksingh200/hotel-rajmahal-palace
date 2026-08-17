"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 space-y-6"
          >
            <span className="text-xs uppercase tracking-[0.35em] text-sandstone font-semibold block">
              OUR PHILOSOPHY
            </span>

            <h2 className="text-3xl sm:text-5xl font-serif text-charcoal tracking-tight leading-tight">
              A QUIET ESCAPE IN THE HILLS
            </h2>

            <div className="w-20 h-0.5 bg-gold" />

            <p className="text-base sm:text-lg font-serif italic text-sandstone">
              &ldquo;Conceived as a sanctuary of authentic Indian architectural grandeur and natural rest.&rdquo;
            </p>

            <p className="text-base text-charcoal/80 leading-relaxed font-sans font-normal">
              Hotel Rajmahal Palace was crafted to celebrate Rajasthan’s timeless sandstone craftsmanship while providing modern comfort framed by quiet mountain slopes. We focus on personal hospitality, restful privacy, and authentic dining.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-sandstone/15">
              <div>
                <h4 className="text-2xl font-serif text-sandstone font-bold">100%</h4>
                <p className="text-xs text-charcoal/70 uppercase tracking-wider mt-1">Heritage Craftsmanship</p>
              </div>
              <div>
                <h4 className="text-2xl font-serif text-sandstone font-bold">360°</h4>
                <p className="text-xs text-charcoal/70 uppercase tracking-wider mt-1">Hill Vista Balconies</p>
              </div>
            </div>
          </motion.div>

          {/* Image Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 grid grid-cols-2 gap-4"
          >
            <div className="relative h-64 sm:h-80 rounded-lg overflow-hidden border border-sandstone/20 shadow-md">
              <Image
                src="/images/about.jpg"
                alt="Sandstone Palace Facade Details"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-64 sm:h-80 rounded-lg overflow-hidden border border-sandstone/20 shadow-md mt-8">
              <Image
                src="/images/balcony.jpg"
                alt="Balcony Overlooking Quiet Green Valleys"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
