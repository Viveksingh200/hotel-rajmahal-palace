"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function EntranceSection() {
  return (
    <section id="entrance" className="py-24 bg-charcoal text-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Image Side with Reveal Animation */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative h-[450px] sm:h-[550px] rounded-lg overflow-hidden border border-gold/30 shadow-2xl group"
          >
            <Image
              src="/images/entrance.jpg"
              alt="Sandstone Entrance Gateway with Carved Wooden Doors"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-xs uppercase tracking-[0.3em] text-gold font-medium block mb-1">
                ROYAL GATEWAY
              </span>
              <h4 className="text-2xl font-serif text-white">Red Sandstone & Teak Doors</h4>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sandstone/30 border border-gold/30">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span className="text-xs uppercase tracking-widest text-gold font-medium">
                THE ARRIVAL EXPERIENCE
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight leading-tight">
              WELCOME TO RAJMAHAL
            </h2>

            <div className="w-20 h-0.5 bg-gold" />

            <p className="text-lg font-serif italic text-gold/90">
              &ldquo;Your stay begins with a warm welcome.&rdquo;
            </p>

            <p className="text-base text-cream/80 leading-relaxed font-sans font-light">
              From the moment you step through our monumental carved wooden gates, the noise of the outside world fades away. Warm red sandstone archways, vibrant tropical flora, and timeless Indian architecture greet every guest with serene royal dignity.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs tracking-wider text-cream/90 font-serif">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold" />
                <span>Carved Teak Doorways</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold" />
                <span>Sandstone Jharokhas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold" />
                <span>Fresh Floral Garland Greeting</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold" />
                <span>Quiet Courtyard Arrival</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
