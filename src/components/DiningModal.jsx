"use client";

import React, { useState, useMemo, useRef } from "react";
import { X, Phone, MessageSquare, Search, Utensils, Leaf, Clock, ChevronRight } from "lucide-react";
import { DINING_DATA } from "@/data/dining";

export default function DiningModal({ isOpen, onClose }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const contentRef = useRef(null);

  // Filtered menu items
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

  // Grouped items by category for "All" view
  const groupedCategories = useMemo(() => {
    if (activeCategory !== "all" || searchQuery.trim() !== "") {
      return null;
    }
    const groups = [];
    DINING_DATA.categories.forEach((cat) => {
      if (cat.id === "all") return;
      const itemsInCat = DINING_DATA.menu.filter((m) => m.category === cat.id);
      if (itemsInCat.length > 0) {
        groups.push({
          category: cat,
          items: itemsInCat,
        });
      }
    });
    return groups;
  }, [activeCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 lg:p-6">
      {/* 1. Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/90 backdrop-blur-xl animate-fadeIn cursor-pointer"
        onClick={onClose}
      />

      {/* 2. Main Luxury Modal Card */}
      <div
        className="relative z-10 w-full max-w-4xl max-h-[94vh] sm:max-h-[90vh] bg-[#121110] border border-[#D4AF37]/40 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.95)] flex flex-col cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-4 py-3.5 sm:px-6 sm:py-4 border-b border-[#D4AF37]/20 bg-[#181614] flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 h-8 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Utensils className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.2em] text-emerald-400 uppercase font-semibold">
                  100% PURE VEG RESTAURANT
                </span>
              </div>
              <h2 className="font-serif text-lg sm:text-2xl text-[#F7F5F2] font-semibold leading-tight">
                Hotel Rajmahal Palace Menu
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            data-cursor="CLOSE"
            aria-label="Close"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#D4AF37]/30 text-[#D6B892] hover:bg-[#D4AF37] hover:text-[#100F0E] transition-all flex items-center justify-center cursor-pointer shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Prominent Direct Call & WhatsApp Order Bar */}
        <div className="bg-gradient-to-r from-[#1a1714] via-[#262018] to-[#1a1714] border-b border-[#D4AF37]/25 px-4 py-3 sm:px-6 sm:py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-[#D4AF37] font-semibold">
              <Phone className="w-3.5 h-3.5" />
              <span>Call & Order Directly</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-center">
            <a
              href={`tel:${DINING_DATA.orderPhoneRaw}`}
              data-cursor="CALL"
              className="flex-1 sm:flex-initial px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-[#C9A86A] via-[#D4AF37] to-[#C9A86A] text-[#100F0E] font-serif text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-full shadow-md hover:scale-105 transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>{DINING_DATA.orderPhone}</span>
            </a>

            <a
              href={`https://wa.me/${DINING_DATA.orderWhatsApp}?text=Hello%20Hotel%20Rajmahal%20Palace,%20I%20would%20like%20to%20order%20food`}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="WHATSAPP"
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-serif text-[11px] sm:text-xs font-semibold uppercase tracking-wider rounded-full border border-emerald-500/30 shadow-md hover:scale-105 transition-all inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Filter Controls (Search + Category Pills) */}
        <div className="px-4 py-3 sm:px-6 sm:py-3.5 border-b border-white/5 bg-[#141210] space-y-2.5">
          {/* Instant Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes (Paneer, Poha, Dal, Biryani, Thali, Maggi)..."
              className="w-full bg-[#181614] border border-[#D4AF37]/25 focus:border-[#D4AF37] text-xs font-sans text-[#F7F5F2] pl-9 pr-8 py-2 rounded-full outline-none transition-all placeholder:text-[#D6B892]/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#D6B892]/70 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Horizontal Category Pills Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar touch-pan-x">
            {DINING_DATA.categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSearchQuery("");
                    if (contentRef.current) contentRef.current.scrollTop = 0;
                  }}
                  data-cursor={cat.name.toUpperCase()}
                  className={`px-3 py-1.5 rounded-full text-[10.5px] sm:text-xs font-serif tracking-wider uppercase whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#D4AF37] text-[#100F0E] font-bold shadow-md"
                      : "bg-[#1c1a17] text-[#D6B892]/80 hover:text-[#F7F5F2] hover:bg-[#26221d] border border-white/5"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Menu Items Content Body */}
        <div
          ref={contentRef}
          className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 touch-pan-y overscroll-contain bg-[#100F0E]"
          data-lenis-prevent
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {/* Case 1: Grouped Category View (When "All" is active and no search) */}
          {groupedCategories ? (
            groupedCategories.map((group, groupIdx) => (
              <div key={group.category.id} className={`space-y-3 ${groupIdx > 0 ? "pt-4 sm:pt-6" : ""}`}>
                {/* Clean Category Section Header */}
                <div className="flex items-center gap-2.5 pb-2 border-b border-[#D4AF37]/25">
                  <span className="text-base sm:text-lg">{group.category.icon}</span>
                  <h3 className="font-serif text-sm sm:text-base font-bold tracking-wider text-[#D4AF37] uppercase">
                    {group.category.name}
                  </h3>
                  <span className="text-[10px] font-mono text-[#D6B892]/60 ml-auto">
                    {group.items.length} items
                  </span>
                </div>

                {/* 2-Column Responsive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3.5">
                  {group.items.map((item, idx) => (
                    <div
                      key={`${item.name}-${idx}`}
                      className="bg-[#161412] border border-[#D4AF37]/15 hover:border-[#D4AF37]/45 rounded-xl p-3 sm:p-3.5 transition-all duration-200 flex items-start justify-between gap-2.5 shadow-sm hover:shadow-md"
                    >
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {/* Pure Veg Green Box Indicator */}
                          <div
                            className="w-3.5 h-3.5 border border-emerald-500 flex items-center justify-center p-0.5 rounded-[2px] shrink-0"
                            title="100% Pure Veg"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          </div>
                          <h4 className="font-serif text-xs sm:text-sm text-[#F7F5F2] font-semibold truncate">
                            {item.name}
                          </h4>
                        </div>
                        <p className="text-[10.5px] sm:text-[11px] text-[#D6B892]/70 font-sans leading-relaxed pl-5 line-clamp-2">
                          {item.desc}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-serif text-xs sm:text-sm font-bold text-[#D4AF37] bg-[#100F0E] px-2 py-0.5 rounded border border-[#D4AF37]/30 inline-block">
                          {item.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : filteredItems.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12 text-[#D6B892]/70 space-y-2">
              <Utensils className="w-8 h-8 text-[#D4AF37]/40 mx-auto" />
              <p className="font-serif text-base">No items found matching &ldquo;{searchQuery}&rdquo;</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="text-xs text-[#D4AF37] underline underline-offset-4 font-serif uppercase tracking-wider"
              >
                Show Full Menu
              </button>
            </div>
          ) : (
            /* Flat Filtered Grid */
            <div className="space-y-3">
              {activeCategory !== "all" && (
                <div className="flex items-center gap-2.5 pb-2 border-b border-[#D4AF37]/25">
                  <span className="text-base sm:text-lg">
                    {DINING_DATA.categories.find((c) => c.id === activeCategory)?.icon}
                  </span>
                  <h3 className="font-serif text-sm sm:text-base font-bold tracking-wider text-[#D4AF37] uppercase">
                    {DINING_DATA.categories.find((c) => c.id === activeCategory)?.name}
                  </h3>
                  <span className="text-[10px] font-mono text-[#D6B892]/60 ml-auto">
                    {filteredItems.length} items
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3.5">
                {filteredItems.map((item, idx) => (
                  <div
                    key={`${item.name}-${idx}`}
                    className="bg-[#161412] border border-[#D4AF37]/15 hover:border-[#D4AF37]/45 rounded-xl p-3 sm:p-3.5 transition-all duration-200 flex items-start justify-between gap-2.5 shadow-sm hover:shadow-md"
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3.5 h-3.5 border border-emerald-500 flex items-center justify-center p-0.5 rounded-[2px] shrink-0"
                          title="100% Pure Veg"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        </div>
                        <h4 className="font-serif text-xs sm:text-sm text-[#F7F5F2] font-semibold truncate">
                          {item.name}
                        </h4>
                      </div>
                      <p className="text-[10.5px] sm:text-[11px] text-[#D6B892]/70 font-sans leading-relaxed pl-5 line-clamp-2">
                        {item.desc}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-serif text-xs sm:text-sm font-bold text-[#D4AF37] bg-[#100F0E] px-2 py-0.5 rounded border border-[#D4AF37]/30 inline-block">
                        {item.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
