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

      {/* Asymmetric Gallery Layout Grid Matching Reference Screenshot */}
      <div className="flex flex-col gap-3.5">
        {Array.from({ length: Math.ceil(displayItems.length / 5) }).map((_, chunkIdx) => {
          const offset = chunkIdx * 5;
          const chunkItems = displayItems.slice(offset, offset + 5);

          const card0 = chunkItems[0];
          const card1 = chunkItems[1];
          const card2 = chunkItems[2];
          const card3 = chunkItems[3];
          const card4 = chunkItems[4];

          return (
            <div key={chunkIdx} className="space-y-3.5">
              {/* Row 1: Left Tall/Wide Card (60%) + Right Stacked Cards (40%) */}
              <div className="grid grid-cols-12 gap-3.5">
                {/* Card 0: Top Left Feature */}
                {card0 && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.05 }}
                    onClick={() => openLightbox(offset + 0)}
                    className="col-span-12 lg:col-span-7 h-[360px] sm:h-[480px] relative rounded-[20px] overflow-hidden border border-white/10 hover:border-[#D4AF37]/50 shadow-2xl group cursor-pointer"
                  >
                    <Image
                      src={card0.src}
                      alt={card0.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 sm:p-7 flex flex-col justify-end">
                      <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mb-1">
                        {card0.subtitle || card0.category}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-serif text-[#F7F5F2] font-normal tracking-wide">
                        {card0.title}
                      </h3>
                    </div>
                    <div className="absolute bottom-5 right-5 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 group-hover:text-[#100F0E] group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] transition-all">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </motion.div>
                )}

                {/* Right Column Stack: Card 1 & Card 2 */}
                <div className="col-span-12 lg:col-span-5 flex flex-col gap-3.5">
                  {/* Card 1: Top Right Upper */}
                  {card1 && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      onClick={() => openLightbox(offset + 1)}
                      className="h-[173px] sm:h-[233px] relative rounded-[20px] overflow-hidden border border-white/10 hover:border-[#D4AF37]/50 shadow-2xl group cursor-pointer"
                    >
                      <Image
                        src={card1.src}
                        alt={card1.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-5 sm:p-6 flex flex-col justify-end">
                        <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mb-1">
                          {card1.subtitle || card1.category}
                        </span>
                        <h3 className="text-base sm:text-xl font-serif text-[#F7F5F2] font-normal tracking-wide">
                          {card1.title}
                        </h3>
                      </div>
                      <div className="absolute bottom-5 right-5 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 group-hover:text-[#100F0E] group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] transition-all">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </motion.div>
                  )}

                  {/* Card 2: Top Right Lower */}
                  {card2 && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.15 }}
                      onClick={() => openLightbox(offset + 2)}
                      className="h-[173px] sm:h-[233px] relative rounded-[20px] overflow-hidden border border-white/10 hover:border-[#D4AF37]/50 shadow-2xl group cursor-pointer"
                    >
                      <Image
                        src={card2.src}
                        alt={card2.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-5 sm:p-6 flex flex-col justify-end">
                        <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mb-1">
                          {card2.subtitle || card2.category}
                        </span>
                        <h3 className="text-base sm:text-xl font-serif text-[#F7F5F2] font-normal tracking-wide">
                          {card2.title}
                        </h3>
                      </div>
                      <div className="absolute bottom-5 right-5 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 group-hover:text-[#100F0E] group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] transition-all">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Row 2: Left Medium Card (40%) + Right Wide Card (60%) */}
              {(card3 || card4) && (
                <div className="grid grid-cols-12 gap-3.5">
                  {/* Card 3: Bottom Left Medium */}
                  {card3 && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      onClick={() => openLightbox(offset + 3)}
                      className="col-span-12 lg:col-span-5 h-[220px] sm:h-[270px] relative rounded-[20px] overflow-hidden border border-white/10 hover:border-[#D4AF37]/50 shadow-2xl group cursor-pointer"
                    >
                      <Image
                        src={card3.src}
                        alt={card3.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 sm:p-7 flex flex-col justify-end">
                        <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mb-1">
                          {card3.subtitle || card3.category}
                        </span>
                        <h3 className="text-lg sm:text-2xl font-serif text-[#F7F5F2] font-normal tracking-wide">
                          {card3.title}
                        </h3>
                      </div>
                      <div className="absolute bottom-5 right-5 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 group-hover:text-[#100F0E] group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] transition-all">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </motion.div>
                  )}

                  {/* Card 4: Bottom Right Wide */}
                  {card4 && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.25 }}
                      onClick={() => openLightbox(offset + 4)}
                      className="col-span-12 lg:col-span-7 h-[220px] sm:h-[270px] relative rounded-[20px] overflow-hidden border border-white/10 hover:border-[#D4AF37]/50 shadow-2xl group cursor-pointer"
                    >
                      <Image
                        src={card4.src}
                        alt={card4.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 sm:p-7 flex flex-col justify-end">
                        <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mb-1">
                          {card4.subtitle || card4.category}
                        </span>
                        <h3 className="text-lg sm:text-2xl font-serif text-[#F7F5F2] font-normal tracking-wide">
                          {card4.title}
                        </h3>
                      </div>
                      <div className="absolute bottom-5 right-5 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 group-hover:text-[#100F0E] group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] transition-all">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          );
        })}
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
