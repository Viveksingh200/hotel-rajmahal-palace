"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Crown,
  Compass,
  Mountain,
  Utensils,
  HeartHandshake,
  ArrowRight,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { useBooking } from "@/context/BookingContext";

export default function AboutPage() {
  const { openBookingDrawer } = useBooking();

  const values = [
    {
      icon: Crown,
      title: "Royal Heritage",
      desc: "Inspired by grand Indian heritage architecture, crafted with hand-carved stone arches, intricate jharokhas, and timeless regal elegance.",
    },
    {
      icon: Mountain,
      title: "Sanctuary in the Hills",
      desc: "Nestled in the lush green hills of Bhimashankar amidst mist-clad Sahyadri ridges, crisp air, and panoramic valley views.",
    },
    {
      icon: HeartHandshake,
      title: "Atithi Devo Bhava",
      desc: "A philosophy that treats every guest as family. Personalized hospitality, warm care, and unforgettable comfort.",
    },
    {
      icon: Utensils,
      title: "Palace Gastronomy",
      desc: "Authentic culinary heritage featuring royal North Indian & Maharashtrian specialties, slow-cooked delicacies, and farm-fresh ingredients.",
    },
  ];

  const milestones = [
    {
      year: "The Vision",
      title: "Conception of a Hillside Palace",
      desc: "Envisioned as a majestic haven combining the elegance of royal heritage with the untouched peace of Bhimashankar.",
    },
    {
      year: "The Craft",
      title: "Authentic Artisanal Stonework",
      desc: "Master artisans hand-crafted every stone pillar, balcony railing, and ornate entryway to honor ancient architectural styles.",
    },
    {
      year: "The Experience",
      title: "Modern Sanctuary & Hospitality",
      desc: "Equipped with state-of-the-art climate control, luxury dark marble bathrooms, and bespoke hospitality services.",
    },
  ];

  return (
    <div className="w-full bg-cream text-charcoal pb-20">
      {/* Subpage Banner Header */}
      <div className="relative h-[320px] sm:h-[420px] w-full flex items-center justify-center text-center overflow-hidden">
        <Image
          src="/images/hero.png"
          alt="About Hotel Rajmahal Palace"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-cream space-y-3 pt-14">
          <span className="text-xs uppercase tracking-[0.4em] text-gold font-medium block">
            OUR STORY & HERITAGE
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif text-white tracking-tight">
            About The Palace
          </h1>
          <div className="w-20 h-0.5 bg-gold mx-auto" />
          <p className="text-base sm:text-lg font-serif italic text-[#D4AF37] max-w-xl mx-auto bg-[#100F0E]/80 py-1 px-3 rounded-full">
            &ldquo;Where grand royal heritage meets the peaceful hills of Bhimashankar.&rdquo;
          </p>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {/* 1. Narrative & Philosophy */}
        <section className="pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Narrative */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 space-y-6"
            >
              <span className="text-xs uppercase tracking-[0.35em] text-sandstone font-semibold block">
                OUR PHILOSOPHY
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif text-charcoal tracking-tight leading-tight">
                A Quiet Escape in the Hills
              </h2>
              <div className="w-16 h-0.5 bg-gold" />

              <p className="text-base sm:text-lg text-charcoal leading-relaxed font-sans">
                Hotel Rajmahal Palace was created as a peaceful hilltop retreat in Bhimashankar, combining grand architectural elegance with warm hospitality, restful privacy, and delicious dining.
              </p>

              <p className="text-sm sm:text-base text-charcoal/80 leading-relaxed font-sans">
                Every detail—from the hand-chiselled red sandstone facades and royal archways to the polished dark marble corridors—reflects centuries of time-honored artisanal tradition. Here, the frantic pace of modern life dissolves into birdsong, mountain breezes, and unhurried luxury.
              </p>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-sandstone/20 text-center">
                <div className="p-3 bg-white/70 rounded-lg border border-gold/30 shadow-sm">
                  <span className="block text-2xl sm:text-3xl font-serif font-bold text-sandstone">100%</span>
                  <span className="text-[10px] sm:text-xs text-charcoal/70 uppercase tracking-wider font-medium">Handcrafted Stone</span>
                </div>
                <div className="p-3 bg-white/70 rounded-lg border border-gold/30 shadow-sm">
                  <span className="block text-2xl sm:text-3xl font-serif font-bold text-sandstone">360°</span>
                  <span className="text-[10px] sm:text-xs text-charcoal/70 uppercase tracking-wider font-medium">Hillside Vistas</span>
                </div>
                <div className="p-3 bg-white/70 rounded-lg border border-gold/30 shadow-sm">
                  <span className="block text-2xl sm:text-3xl font-serif font-bold text-sandstone">24/7</span>
                  <span className="text-[10px] sm:text-xs text-charcoal/70 uppercase tracking-wider font-medium">Royal Service</span>
                </div>
              </div>
            </motion.div>

            {/* Right Visual Composition */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 grid grid-cols-2 gap-4 sm:gap-6 relative"
            >
              <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden border border-gold/40 shadow-xl">
                <Image
                  src="/images/KAMSHET.jpg"
                  alt="Palace Facade and Red Sandstone Arches"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden border border-gold/40 shadow-xl mt-8">
                <Image
                  src="/images/balcony.jpg"
                  alt="Palace Balcony overlooking scenic mountain valley"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. Core Pillars of Our Hospitality */}
        <section className="py-20 my-10 bg-charcoal text-cream rounded-3xl p-8 sm:p-14 relative overflow-hidden border border-gold/30 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs uppercase tracking-[0.35em] text-gold font-semibold block">
                OUR GUIDING PRINCIPLES
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
                The Pillars of Royal Hospitality
              </h2>
              <div className="w-20 h-0.5 bg-gold mx-auto my-3" />
              <p className="text-sm sm:text-base font-serif italic text-gold/90">
                &ldquo;Every guest is welcomed not merely as a visitor, but as an honored guest of the palace.&rdquo;
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((val, idx) => {
                const Icon = val.icon;
                return (
                  <motion.div
                    key={val.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="bg-black/40 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-gold/25 shadow-lg hover:border-gold/60 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-gold mb-6 group-hover:scale-110 group-hover:bg-[#D4AF37] group-hover:text-[#100F0E] transition-all">
                      <Icon className="w-6 h-6 text-current" />
                    </div>
                    <h3 className="text-xl font-serif text-white mb-3 group-hover:text-gold transition-colors">
                      {val.title}
                    </h3>
                    <p className="text-sm text-cream/70 leading-relaxed font-sans font-light">
                      {val.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. Journey & Creation Timeline */}
        <section className="py-20">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-[0.35em] text-sandstone font-semibold block">
              HOW IT WAS BUILT
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-charcoal tracking-tight">
              The Journey of Creation
            </h2>
            <div className="w-16 h-0.5 bg-gold mx-auto" />
          </div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:left-1/2 before:-translate-x-1/2 before:w-0.5 before:bg-gold/30 before:hidden md:before:block">
            {milestones.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`flex flex-col md:flex-row items-center gap-6 md:gap-12 ${index % 2 === 1 ? "md:flex-row-reverse text-left md:text-right" : "text-left"
                  }`}
              >
                <div className="w-full md:w-1/2">
                  <div className="p-6 sm:p-8 bg-white rounded-2xl border border-gold/30 shadow-md hover:shadow-xl transition-shadow">
                    <span className="text-xs font-mono uppercase tracking-widest text-sandstone font-semibold block mb-2">
                      {item.year}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif text-charcoal mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm text-charcoal/70 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Center Indicator */}
                <div className="w-8 h-8 rounded-full bg-sandstone border-4 border-white shadow-md flex items-center justify-center text-white z-10 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>

                <div className="hidden md:block w-1/2" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. Direct Booking CTA */}
        <section className="mt-16 py-16 bg-charcoal text-cream rounded-3xl p-8 text-center relative overflow-hidden border border-gold/30 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/15 via-transparent to-transparent pointer-events-none" />

          <div className="max-w-3xl mx-auto relative z-10 space-y-6">
            <span className="text-xs uppercase tracking-[0.4em] text-gold font-semibold block">
              EXPERIENCE IT IN PERSON
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
              Your Royal Stay Begins Here
            </h2>
            <div className="w-20 h-0.5 bg-gold mx-auto my-3" />
            <p className="text-base sm:text-lg font-serif italic text-gold/90 max-w-xl mx-auto">
              &ldquo;Reserve your sanctuary and immerse yourself in peaceful luxury, balcony hill vistas, and regal dining.&rdquo;
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => openBookingDrawer()}
                className="w-full sm:w-auto px-9 py-4 bg-sandstone hover:bg-sandstone-dark text-cream font-serif text-xs font-semibold uppercase tracking-[0.25em] rounded-sm shadow-xl hover:scale-105 transition-all cursor-pointer inline-flex items-center justify-center gap-2 border border-gold/40"
              >
                <Calendar className="w-4 h-4 text-gold" />
                <span>RESERVE YOUR STAY</span>
              </button>

              <Link
                href="/rooms"
                className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-cream font-serif text-xs font-semibold uppercase tracking-[0.2em] rounded-sm border border-white/20 hover:border-gold transition-all inline-flex items-center justify-center gap-2"
              >
                <span>EXPLORE ROOMS</span>
                <ArrowRight className="w-4 h-4 text-gold" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
