"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { GALLERY_CATEGORIES, GALLERY_ITEMS } from "@/data/gallery";
import { X, ChevronLeft, ChevronRight, Maximize2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GalleryLightbox({ showFilter = true, limit = null }) {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  const filteredItems =
    activeCategory === "ALL"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  const displayItems = limit ? filteredItems.slice(0, limit) : filteredItems;

  const openLightbox = (index) => {
    setActiveImageIndex(index);
  };

  const closeLightbox = () => {
    setActiveImageIndex(null);
  };

  const prevImage = (e) => {
    if (e) e.stopPropagation();
    if (activeImageIndex === null) return;
    setActiveImageIndex((prev) => (prev === 0 ? displayItems.length - 1 : prev - 1));
  };

  const nextImage = (e) => {
    if (e) e.stopPropagation();
    if (activeImageIndex === null) return;
    setActiveImageIndex((prev) => (prev === displayItems.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation & Escape key handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeImageIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageIndex, displayItems.length]);

  // Lock body scroll when lightbox is active
  useEffect(() => {
    if (activeImageIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeImageIndex]);

  return (
    <div className="w-full">
      {/* Category Filter Tabs */}
      {showFilter && (
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12">
          {GALLERY_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-serif tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-[#D4AF37] text-[#100F0E] border border-[#D4AF37] shadow-lg font-semibold scale-105"
                    : "bg-[#161412] text-[#D6B892]/80 hover:text-[#F7F5F2] hover:bg-[#1A1816]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayItems.map((item, idx) => (
          <motion.div
            layout
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            onClick={() => openLightbox(idx)}
            className="relative h-72 rounded-lg overflow-hidden border border-[#D4AF37]/20 shadow-md group cursor-pointer"
          >
            <Image
              src={item.src}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#100F0E]/90 via-[#100F0E]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">
                {item.category}
              </span>
              <h4 className="text-lg font-serif text-[#F7F5F2]">{item.title}</h4>
              <p className="text-xs text-[#D6B892]/80 line-clamp-1 mt-0.5">{item.caption}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#D4AF37] font-serif">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>View Fullscreen</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {activeImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8 cursor-pointer select-none"
          >
            {/* Top Bar */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-between z-10 text-[#F7F5F2] max-w-7xl w-full mx-auto"
            >
              <div>
                <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-mono block">
                  {displayItems[activeImageIndex].category}
                </span>
                <h3 className="text-lg font-serif">{displayItems[activeImageIndex].title}</h3>
              </div>

              {/* Close / Back Button */}
              <button
                onClick={closeLightbox}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#161412] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#100F0E] border border-[#D4AF37]/50 shadow-lg transition-all duration-200 cursor-pointer font-serif text-xs tracking-widest uppercase"
                aria-label="Close photo viewer"
              >
                <X className="w-4 h-4" />
                <span>CLOSE (ESC)</span>
              </button>
            </div>

            {/* Image Viewer Center */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative flex-grow flex items-center justify-center my-4"
            >
              <div className="relative w-full max-w-5xl h-[70vh] rounded-lg overflow-hidden flex items-center justify-center">
                <Image
                  src={displayItems[activeImageIndex].src}
                  alt={displayItems[activeImageIndex].title}
                  fill
                  priority
                  className="object-contain"
                />
              </div>

              {/* Prev Button */}
              <button
                onClick={prevImage}
                className="absolute left-2 sm:left-6 p-3.5 rounded-full bg-[#100F0E]/80 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#100F0E] border border-[#D4AF37]/40 shadow-xl transition-all cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next Button */}
              <button
                onClick={nextImage}
                className="absolute right-2 sm:right-6 p-3.5 rounded-full bg-[#100F0E]/80 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#100F0E] border border-[#D4AF37]/40 shadow-xl transition-all cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Caption & Counter & Back Button */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="text-center z-10 space-y-2 max-w-2xl mx-auto"
            >
              <p className="text-sm font-serif italic text-[#D6B892]">
                {displayItems[activeImageIndex].caption}
              </p>
              <div className="flex items-center justify-center gap-4 pt-1">
                <span className="text-xs text-[#D4AF37]/80 font-mono">
                  {activeImageIndex + 1} of {displayItems.length}
                </span>
                <button
                  onClick={closeLightbox}
                  className="text-xs text-[#D6B892]/80 hover:text-[#D4AF37] underline underline-offset-4 font-serif uppercase tracking-wider cursor-pointer flex items-center gap-1 mx-auto"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Gallery</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
