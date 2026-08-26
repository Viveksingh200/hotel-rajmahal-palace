"use client";

import React, { useState, useMemo } from "react";
import { DINING_DATA } from "@/data/dining";
import { Phone, MessageSquare, Search, Utensils, Sparkles, Clock, ShieldCheck, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RestaurantMenu() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    return DINING_DATA.menu.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section id="menu" className="py-16 sm:py-24 bg-[#100F0E] text-[#F7F5F2] relative">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e1a14] border border-[#D4AF37]/40 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-serif uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
              100% PURE VEG RESTAURANT
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif text-[#F7F5F2] font-normal tracking-tight">
            Hotel Rajmahal Palace Menu
          </h2>

          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />

          <p className="text-sm sm:text-base text-[#D6B892]/80 font-serif italic">
            Authentic Maharashtrian, North Indian, Punjabi, Chinese & Royal Fasting Delicacies
          </p>

          {/* Timings Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-[#D6B892]/70 font-mono">
            <span className="px-3 py-1 bg-[#181614] rounded-full border border-white/5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> Breakfast: 7:00 AM – 11:00 AM
            </span>
            <span className="px-3 py-1 bg-[#181614] rounded-full border border-white/5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> Lunch & Dinner: 12:00 PM – 11:00 PM
            </span>
          </div>
        </div>

        {/* Prominent Call & WhatsApp Order Banner (No online payment required) */}
        <div className="mb-12 bg-gradient-to-r from-[#181614] via-[#241e17] to-[#181614] border-2 border-[#D4AF37]/60 rounded-2xl p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.8)] text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.3em] text-[#D4AF37] uppercase font-bold block">
              DIRECT ROOM SERVICE & TABLE ORDERS
            </span>

            <h3 className="text-xl sm:text-3xl font-serif text-[#F7F5F2]">
              Call or WhatsApp to Order Anything
            </h3>

            <p className="text-xs sm:text-sm text-[#D6B892]/90 leading-relaxed font-sans">
              Enjoy freshly prepared pure vegetarian meals delivered hot to your room or reserved table. Simply dial our kitchen desk to place your order.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href={`tel:${DINING_DATA.orderPhoneRaw}`}
                data-cursor="CALL"
                className="px-7 py-3.5 bg-gradient-to-r from-[#C9A86A] via-[#D4AF37] to-[#C9A86A] text-[#100F0E] font-serif text-xs tracking-wider uppercase font-bold rounded-full shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:scale-105 transition-all inline-flex items-center gap-2.5 cursor-pointer"
              >
                <Phone className="w-4 h-4 fill-current" />
                <span>Call to Order: {DINING_DATA.orderPhone}</span>
              </a>

              <a
                href={`https://wa.me/${DINING_DATA.orderWhatsApp}?text=Hello%20Hotel%20Rajmahal%20Palace,%20I%20would%20like%20to%20place%20a%20food%20order`}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="WHATSAPP"
                className="px-6 py-3.5 bg-emerald-700/90 hover:bg-emerald-600 text-white font-serif text-xs tracking-wider uppercase font-semibold rounded-full border border-emerald-500/40 shadow-lg hover:scale-105 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Order on WhatsApp</span>
              </a>
            </div>

            <p className="text-[11px] text-[#D6B892]/60 font-mono pt-1">
              ✓ Fast Delivery to Rooms • ✓ Pure Vegetarian Kitchen • ✓ Jain Options Available
            </p>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="space-y-6 mb-10">
          {/* Search Input */}
          <div className="max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-[#D4AF37] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes (e.g. Paneer, Poha, Dal, Biryani)..."
              className="w-full bg-[#181614] border border-[#D4AF37]/30 focus:border-[#D4AF37] text-xs font-sans text-[#F7F5F2] pl-11 pr-4 py-3 rounded-full outline-none transition-all placeholder:text-[#D6B892]/40 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#D6B892]/60 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Navigation Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-[#D4AF37]/20 no-scrollbar justify-start lg:justify-center">
            {DINING_DATA.categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSearchQuery("");
                  }}
                  data-cursor={cat.name.toUpperCase()}
                  className={`px-4 py-2 rounded-full text-xs font-serif tracking-wider uppercase whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#D4AF37] text-[#100F0E] font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-105"
                      : "bg-[#181614] text-[#D6B892]/80 hover:text-[#F7F5F2] hover:bg-[#201d19] border border-white/5"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-[#161412] rounded-xl border border-white/10 p-8">
            <Utensils className="w-10 h-10 text-[#D4AF37]/50 mx-auto mb-3" />
            <h4 className="font-serif text-xl text-[#F7F5F2] mb-1">No Dishes Found</h4>
            <p className="text-xs text-[#D6B892]/70 mb-4">
              We couldn&apos;t find any item matching &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="px-5 py-2 bg-[#D4AF37] text-[#100F0E] text-xs font-serif uppercase tracking-widest rounded-full font-bold"
            >
              View Full Menu
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            <AnimatePresence>
              {filteredItems.map((item, idx) => (
                <motion.div
                  key={`${item.name}-${idx}`}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.02, 0.3) }}
                  className="bg-[#181614] border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 rounded-xl p-5 shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    {/* Top Row: Veg Dot + Title + Price */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        {/* Pure Veg Green Square Symbol */}
                        <div className="w-4 h-4 border border-emerald-500 flex items-center justify-center p-0.5 rounded-[2px] shrink-0 mt-1" title="100% Pure Vegetarian">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        </div>
                        <div>
                          <h4 className="font-serif text-base sm:text-lg text-[#F7F5F2] font-medium group-hover:text-[#D4AF37] transition-colors">
                            {item.name}
                          </h4>
                        </div>
                      </div>

                      {/* Price Badge */}
                      <span className="font-serif text-base sm:text-lg font-bold text-[#D4AF37] whitespace-nowrap bg-[#100F0E] px-2.5 py-0.5 rounded-md border border-[#D4AF37]/30 shrink-0">
                        {item.price}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#D6B892]/75 font-sans leading-relaxed pl-6">
                      {item.desc}
                    </p>
                  </div>

                  {/* Bottom Quick Action: WhatsApp Order for this dish */}
                  <div className="pt-4 mt-2 border-t border-white/5 flex items-center justify-between pl-6 text-xs text-[#D6B892]/60">
                    <span className="uppercase tracking-widest text-[10px] font-mono text-[#D4AF37]/70">
                      {item.category.replace("-", " ")}
                    </span>

                    <a
                      href={`https://wa.me/${DINING_DATA.orderWhatsApp}?text=Hello%20Hotel%20Rajmahal%20Palace,%20I%20would%20like%20to%20order%20${encodeURIComponent(item.name)}%20(${item.price})`}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="ORDER"
                      className="text-[11px] font-serif uppercase tracking-wider text-[#D4AF37] hover:text-white flex items-center gap-1 hover:underline underline-offset-4 cursor-pointer"
                    >
                      <span>Order</span>
                      <span className="text-xs">&rarr;</span>
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Bottom Call Direct Notice */}
        <div className="mt-16 text-center bg-[#181614] border border-[#D4AF37]/30 rounded-xl p-8 max-w-2xl mx-auto space-y-3">
          <Utensils className="w-6 h-6 text-[#D4AF37] mx-auto" />
          <h4 className="font-serif text-xl text-[#F7F5F2]">Special Dietary & Jain Food Requests</h4>
          <p className="text-xs text-[#D6B892]/80 leading-relaxed font-sans">
            Have special fasting (Upvas) preferences or Jain dietary requirements? Let our chef know when placing your call.
          </p>
          <a
            href={`tel:${DINING_DATA.orderPhoneRaw}`}
            data-cursor="CALL"
            className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-white font-serif text-xs font-bold uppercase tracking-widest pt-2"
          >
            <Phone className="w-4 h-4" />
            <span>Direct Kitchen Desk: {DINING_DATA.orderPhone}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
