"use client";

import { useState } from "react";
import Image from "next/image";
import { X, BedDouble, Users, ArrowRight, ShieldCheck, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { ROOMS_DATA } from "@/data/rooms";

export default function SuiteModal({ isOpen, onClose, onSelectSuite }) {
  const [activeModalImgIndex, setActiveModalImgIndex] = useState(0);

  if (!isOpen) return null;

  const room = ROOMS_DATA[0];
  const galleryImages = (Array.isArray(room.gallery) && room.gallery.length > 0)
    ? room.gallery
    : [
        "/images/heritage-deluxe-room.jpg",
        "/images/bedroom.jpg",
        "/images/bathroom.jpg",
        "/images/balcony.jpg",
        "/images/hill-view-suite.png",
      ];

  const currentImg = galleryImages[activeModalImgIndex] || room.featuredImage;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 lg:p-10">
      {/* 1. Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-[#0A0908]/92 backdrop-blur-2xl animate-fadeIn cursor-pointer"
        onClick={onClose}
      />

      {/* 2. Modal Container */}
      <div
        className="relative z-10 w-full max-w-6xl max-h-[85vh] sm:max-h-[90vh] bg-[#100F0E] border border-[#D4AF37]/35 rounded-xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 lg:p-8 border-b border-[#D4AF37]/20 flex items-center justify-between bg-[#161412]/80 backdrop-blur-md">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#D4AF37] uppercase font-semibold">
              PALACE ACCOMMODATIONS
            </span>
            <h2 className="font-serif text-2xl lg:text-4xl text-[#F7F5F2] font-normal tracking-wide">
              Rooms & Royal Suites
            </h2>
          </div>
          <button
            onClick={onClose}
            data-cursor="CLOSE"
            aria-label="Close"
            className="p-2.5 rounded-full border border-[#D4AF37]/30 text-[#D6B892] hover:bg-[#D4AF37] hover:text-[#100F0E] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div
          className="p-6 lg:p-8 overflow-y-auto space-y-6 flex-1 touch-pan-y overscroll-contain"
          data-lenis-prevent
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-[#161412] border border-[#D4AF37]/35 rounded-xl overflow-hidden shadow-2xl space-y-6">
              {/* Photo Showcase Carousel */}
              <div className="relative h-64 sm:h-80 lg:h-96 w-full bg-charcoal">
                <Image
                  key={currentImg}
                  src={currentImg}
                  alt={room.name}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                {/* Photo Counter */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="text-[11px] font-mono uppercase tracking-wider bg-black/70 backdrop-blur-md text-gold border border-gold/40 px-2.5 py-1 rounded-sm shadow-md flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5" />
                    <span>{activeModalImgIndex + 1} / {galleryImages.length} Photos</span>
                  </span>
                </div>

                {/* Arrows */}
                <button
                  type="button"
                  onClick={() => setActiveModalImgIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-gold hover:text-charcoal text-cream backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalImgIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-gold hover:text-charcoal text-cream backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Thumbnails Row */}
              <div className="px-6 flex items-center gap-2.5 overflow-x-auto pb-2">
                {galleryImages.map((imgSrc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveModalImgIndex(idx)}
                    className={`relative shrink-0 w-16 sm:w-20 h-12 sm:h-14 rounded overflow-hidden transition-all cursor-pointer ${
                      activeModalImgIndex === idx
                        ? "ring-2 ring-gold border-2 border-gold opacity-100"
                        : "opacity-60 hover:opacity-100 border border-white/20 hover:border-gold/60"
                    }`}
                  >
                    <Image src={imgSrc} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>

              {/* Details & Specs */}
              <div className="px-6 pb-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#D4AF37]/15 pb-4">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase block mb-1">
                      {room.view}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#F7F5F2] font-semibold">
                      {room.name}
                    </h3>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-mono text-[#D6B892]/60 uppercase block">PER NIGHT</span>
                    <span className="font-serif text-3xl text-[#D4AF37] font-bold">
                      {room.currency}{Number(room.pricePerNight).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <p className="text-sm font-serif italic text-[#D6B892]/90 leading-relaxed">
                  &ldquo;{room.tagline}&rdquo;
                </p>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-3 py-3 px-4 bg-[#100F0E] rounded-lg border border-[#D4AF37]/15 text-xs text-[#D6B892]">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#D4AF37]" />
                    <span className="truncate">{room.maxAdults} Adults + {room.maxChildren} Kids</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BedDouble className="w-4 h-4 text-[#D4AF37]" />
                    <span className="truncate">{room.bedType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                    <span className="truncate">Private Balcony</span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-[#D4AF37]/15">
                  <div className="text-[11px] sm:text-xs font-mono text-[#D6B892]/70">
                    22-Hour Stay Policy (Check-out 22h from check-in)
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      if (onSelectSuite) onSelectSuite(room);
                    }}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-[#C9A86A] via-[#D4AF37] to-[#C9A86A] text-[#100F0E] text-[11px] sm:text-xs font-serif uppercase tracking-[0.16em] sm:tracking-[0.2em] font-semibold rounded shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Reserve Suite</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

