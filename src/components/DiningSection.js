"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Utensils, ArrowRight } from "lucide-react";

export default function DiningSection() {
  return (
    <section id="dining" className="py-24 bg-cream-muted text-charcoal relative">
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sandstone/15 text-sandstone">
              <Utensils className="w-3.5 h-3.5" />
              <span className="text-xs uppercase tracking-widest font-semibold">PALACE GASTRONOMY</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif text-charcoal tracking-tight">
              DINE WITH US
            </h2>

            <div className="w-20 h-0.5 bg-gold" />

            <p className="text-lg font-serif italic text-sandstone">
              &ldquo;Enjoy relaxed dining in a warm and welcoming setting.&rdquo;
            </p>

            <p className="text-base text-charcoal/80 leading-relaxed font-sans">
              Set within a sunlit courtyard hall adorned with glowing chandeliers, dark green velvet banquettes, white metal accent chairs, and polished marble dining tables. Our kitchen celebrates authentic Indian heritage recipes alongside international comfort dining.
            </p>

            <div className="grid grid-cols-2 gap-4 py-3 border-y border-sandstone/15 text-xs font-serif text-charcoal">
              <div>
                <span className="font-semibold text-sandstone block mb-0.5">BREAKFAST</span>
                <span>7:30 AM – 10:30 AM</span>
              </div>
              <div>
                <span className="font-semibold text-sandstone block mb-0.5">LUNCH & DINNER</span>
                <span>12:30 PM – 10:30 PM</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/dining"
                className="inline-flex items-center gap-2 text-sandstone hover:text-sandstone-dark font-serif text-sm tracking-wider uppercase font-semibold group"
              >
                <span>EXPLORE DINING EXPERIENCE</span>
                <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 relative h-[450px] sm:h-[520px] rounded-lg overflow-hidden border border-sandstone/20 shadow-xl group"
          >
            <Image
              src="/images/dinning.png"
              alt="Palace Courtyard Restaurant with Marble Tables and Green Seating"
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
