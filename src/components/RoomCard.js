"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Users,
  BedDouble,
  Eye,
  Sparkles,
  Calendar,
  Lock,
  ChevronLeft,
  ChevronRight,
  Camera,
  Crown,
  Coffee,
  Wifi,
  Tv,
  Bath,
  ShieldCheck,
  Check,
  Maximize2,
  X,
  ArrowRight,
  Sparkle,
  Droplets,
  GlassWater,
  Layers,
  Moon
} from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function RoomCard({ room }) {
  const { startBookingForRoom, openSuites } = useBooking();
  const { isAuthenticated, openLoginModal } = useAuth();
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Normalize properties from either Supabase DB schema or local static JS schema
  const roomName = room.room_name || room.name || "Heritage Deluxe Room";
  const price = room.price_per_night !== undefined ? room.price_per_night : (room.pricePerNight !== undefined ? room.pricePerNight : 3000);
  const currency = room.currency || "₹";
  const bed = room.bed_type || room.bedType || "King Heritage Bed";
  const maxAdults = room.max_adults || room.maxAdults || 3;
  const maxChildren = room.max_children || room.maxChildren || 2;
  const guests = room.max_guests || room.maxGuests || (maxAdults + maxChildren);
  const image = room.image_url || room.featuredImage || "/images/heritage-deluxe-room.jpg";
  const slug = room.slug || room.id || "heritage-deluxe-room";
  const tagline = room.tagline || room.description || "Authentic warmth with dark marble elegance and serene green hill vistas";
  const status = (room.availability_status || room.availabilityStatus || "available").toLowerCase();
  const isAvailable = status === "available" && room.is_active !== false;

  // Gallery list with curated photos
  const galleryImages = [
    "/images/bedroom1.png",
    "/images/rooms.png",
  ];

  const currentImage = galleryImages[activeImgIndex] || image;

  const handlePrevImg = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImg = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const normalizedRoom = {
    ...room,
    id: room.id || "heritage-deluxe-room",
    slug: slug,
    name: roomName,
    pricePerNight: price,
    currency: currency,
    maxGuests: guests,
    maxAdults: maxAdults,
    maxChildren: maxChildren,
    bedType: bed,
    featuredImage: image,
    gallery: galleryImages,
    description: room.description || tagline,
    amenities: room.amenities || [
      "Two Towels",
      "Mattress",
      "Blanket",
      "Pillows",
      "Bedsheet",
      "Shampoo",
      "Shower Gel",
      "Kettle",
      "Water Bottle",
    ],
    highlights: room.highlights || ["Max 3 Adults & 2 Children", "Courtyard View", "Dark Marble Bath", "Private Balcony"],
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className={`w-full bg-gradient-to-br from-[#181614] via-[#141210] to-[#100F0E] rounded-2xl overflow-hidden border transition-all duration-500 shadow-[0_25px_60px_rgba(0,0,0,0.85)] group ${isAvailable
          ? "border-[#D4AF37]/35 hover:border-[#D4AF37] hover:shadow-[0_30px_70px_rgba(212,175,55,0.15)]"
          : "border-red-900/30 opacity-90"
          }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Side: Multi-Image Interactive Gallery (Occupies ~6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-[#0E0D0C] border-b lg:border-b-0 lg:border-r border-[#D4AF37]/20">
            {/* Main Image Showcase */}
            <div
              className="relative h-64 xs:h-72 sm:h-84 lg:h-[420px] w-full overflow-hidden bg-black group/gallery cursor-pointer"
              onClick={() => setIsLightboxOpen(true)}
              title="Click to view full photo"
            >
              <Image
                key={currentImage}
                src={currentImage}
                alt={`${roomName} - Photo ${activeImgIndex + 1}`}
                fill
                priority
                className={`object-cover transition-all duration-700 ${isAvailable ? "group-hover/gallery:scale-105" : "grayscale-[40%]"
                  }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#100F0E] via-black/25 to-black/40 pointer-events-none" />

              {/* Top Left Room Title & Status Badge */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-wrap items-center gap-2 max-w-[65%]">
                <span className="block md:hidden text-[11px] sm:text-sm font-serif font-bold text-white bg-black/85 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-sm border border-[#D4AF37]/60 tracking-wide flex items-center gap-1.5 truncate max-w-full">
                  <span>{roomName}</span>
                </span>

                {!isAvailable && (
                  <div className="bg-red-900/90 text-white font-mono text-[9px] sm:text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-sm border border-red-500/40 shadow-xl flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-red-300" />
                    <span>{status === "maintenance" ? "Under Maintenance" : "Unavailable"}</span>
                  </div>
                )}
              </div>

              {/* Photo Counter & Enlarge Button */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLightboxOpen(true);
                  }}
                  className="text-[9.5px] sm:text-[11px] font-mono uppercase tracking-wider bg-black/75 hover:bg-[#D4AF37] hover:text-[#100F0E] text-[#D4AF37] backdrop-blur-md border border-[#D4AF37]/40 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-sm shadow-xl flex items-center gap-1 sm:gap-1.5 transition-colors cursor-pointer"
                >
                  <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>{activeImgIndex + 1} / {galleryImages.length} Photos</span>
                </button>
              </div>

              {/* Navigation Arrows */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImg}
                    aria-label="Previous Image"
                    className="absolute left-2 sm:left-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/70 hover:bg-[#D4AF37] hover:text-[#100F0E] text-[#F7F5F2] backdrop-blur-md border border-[#D4AF37]/40 flex items-center justify-center transition-all cursor-pointer shadow-2xl hover:scale-110"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextImg}
                    aria-label="Next Image"
                    className="absolute right-2 sm:right-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/70 hover:bg-[#D4AF37] hover:text-[#100F0E] text-[#F7F5F2] backdrop-blur-md border border-[#D4AF37]/40 flex items-center justify-center transition-all cursor-pointer shadow-2xl hover:scale-110"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Clickable Gallery Thumbnails Strip */}
            <div className="p-2.5 sm:p-3.5 bg-[#100F0E] border-t border-[#D4AF37]/20 hidden md:flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none touch-pan-x">
              {galleryImages.map((imgSrc, idx) => {
                const isActive = activeImgIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImgIndex(idx);
                    }}
                    className={`relative shrink-0 w-14 sm:w-20 h-10 sm:h-14 rounded-md overflow-hidden transition-all duration-300 cursor-pointer ${isActive
                      ? "ring-2 ring-[#D4AF37] border-2 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.5)] scale-105 opacity-100"
                      : "opacity-60 hover:opacity-100 border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:scale-102"
                      }`}
                  >
                    <Image
                      src={imgSrc}
                      alt={`Room photo thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                    {isActive && (
                      <div className="absolute inset-0 bg-[#D4AF37]/20" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Side: Royal Details & Booking CTA (Occupies ~6 cols) */}
          <div className="lg:col-span-6 p-4 sm:p-6 lg:p-8 flex flex-col justify-between space-y-4 sm:space-y-6">
            <div className="space-y-4 sm:space-y-5">
              {/* Header Title & Pricing Row */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 sm:gap-3 border-b border-[#D4AF37]/20 pb-3.5 sm:pb-4">
                <div className="hidden md:block">
                  <span className="text-[10px] sm:text-[10.5px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-bold block mb-0.5 sm:mb-1">
                    ROYAL SANCTUARY
                  </span>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif text-[#F7F5F2] font-semibold tracking-wide">
                    {roomName}
                  </h3>
                </div>

                <div className="text-left sm:text-right shrink-0 pt-1 sm:pt-0">
                  <div className="flex items-center sm:justify-end gap-2">
                    <span className="text-xs font-mono text-[#D6B892]/50 line-through">₹5,500</span>
                    <span className="text-[9.5px] sm:text-[10px] font-mono uppercase bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded border border-[#D4AF37]/30 font-semibold">
                      DIRECT EXCLUSIVE
                    </span>
                  </div>
                  <div className="flex items-baseline sm:justify-end gap-1.5 mt-0.5">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#D4AF37] font-bold tracking-tight">
                      {currency}{Number(price).toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-[#D6B892]/70 font-sans">/ night</span>
                  </div>
                  <span className="text-[10.5px] sm:text-[11px] text-[#D6B892]/60 font-mono block">
                    All Taxes Included • No GST Added
                  </span>
                </div>
              </div>

              {/* Tagline Description - Hidden in Mobile View */}
              <p className="hidden md:block text-xs sm:text-sm font-serif italic text-[#D6B892]/90 leading-relaxed">
                &ldquo;{tagline}&rdquo;
              </p>

              {/* 4 Pillars Specification Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 p-2.5 sm:p-3.5 bg-[#100F0E] rounded-xl border border-[#D4AF37]/20 text-xs text-[#D6B892]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[9px] sm:text-[9.5px] text-[#D6B892]/60 block uppercase font-mono">Guests</span>
                    <span className="font-semibold text-[#F7F5F2] text-[11px] sm:text-xs">{maxAdults}A + {maxChildren}K</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <BedDouble className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[9px] sm:text-[9.5px] text-[#D6B892]/60 block uppercase font-mono">Bedding</span>
                    <span className="font-semibold text-[#F7F5F2] text-[11px] sm:text-xs">{bed.split(" ")[0]} Bed</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Bath className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[9px] sm:text-[9.5px] text-[#D6B892]/60 block uppercase font-mono">Bath</span>
                    <span className="font-semibold text-[#F7F5F2] text-[11px] sm:text-xs">Rain Shower</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[9px] sm:text-[9.5px] text-[#D6B892]/60 block uppercase font-mono">Terrace</span>
                    <span className="font-semibold text-[#F7F5F2] text-[11px] sm:text-xs">Balcony</span>
                  </div>
                </div>
              </div>

              {/* 22-Hour Policy & Non-Refundable Tagline */}
              <div className="p-2.5 sm:p-3 bg-[#100F0E]/90 rounded-lg border border-[#D4AF37]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2 text-[11px] sm:text-xs font-mono text-[#D6B892]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" />
                  <span className="text-[#F7F5F2] font-semibold">22-Hour Stay</span>
                  <span className="text-white/30">•</span>
                  <span className="text-[#E6C875] font-sans font-medium">Non-Refundable</span>
                </div>
                <span className="text-[#D6B892]/80">22-Hour Stay Policy</span>
              </div>
            </div>

            {/* Action Row */}
            <div className="pt-2 sm:pt-3 border-t border-[#D4AF37]/20 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              {isAvailable ? (
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      openLoginModal({ autoOpenBooking: true, room: normalizedRoom });
                      return;
                    }
                    startBookingForRoom(normalizedRoom);
                  }}
                  data-cursor="RESERVE"
                  className="w-full sm:flex-1 py-3 sm:py-4 px-3 sm:px-8 bg-gradient-to-r from-[#C9A86A] via-[#D4AF37] to-[#C9A86A] text-[#100F0E] font-serif text-[11px] min-[360px]:text-xs sm:text-sm uppercase tracking-[0.14em] min-[360px]:tracking-[0.2em] sm:tracking-[0.22em] font-bold rounded-md shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_45px_rgba(212,175,55,0.6)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 sm:gap-2.5 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#100F0E] shrink-0" />
                  <span>RESERVE NOW</span>
                  <ArrowRight className="w-4 h-4 text-[#100F0E] shrink-0" />
                </button>
              ) : (
                <button
                  disabled
                  className="w-full sm:flex-1 py-3 sm:py-4 px-3 sm:px-8 bg-stone-800 text-stone-400 font-serif text-[11px] sm:text-sm tracking-widest uppercase rounded border border-stone-700 text-center flex items-center justify-center gap-2 cursor-not-allowed opacity-75"
                >
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>{status === "maintenance" ? "UNDER MAINTENANCE" : "UNAVAILABLE"}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="w-full sm:w-auto px-3.5 sm:px-5 py-2.5 sm:py-4 bg-[#161412] hover:bg-[#1f1b17] text-[#D6B892] hover:text-[#D4AF37] border border-[#D4AF37]/35 rounded-md font-serif text-[11px] sm:text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 shrink-0" />
                <span>View All Photos</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Standalone Section: INCLUDED PALACE PRIVILEGES (BELOW THE CARD) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-4 sm:mt-8 w-full bg-[#121110]/95 border border-[#D4AF37]/25 rounded-xl sm:rounded-2xl p-3.5 sm:p-8 shadow-xl space-y-3 sm:space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 border-b border-[#D4AF37]/15 pb-2.5 sm:pb-4">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-[9.5px] sm:text-[10px] font-mono uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#D4AF37] font-semibold block">
                COMPLIMENTARY PALACE AMENITIES
              </span>
              <h4 className="text-sm sm:text-lg font-serif text-[#F7F5F2] font-semibold">
                INCLUDED PALACE PRIVILEGES
              </h4>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-2.5 text-xs font-sans">
          {/* 1. Two Towels */}
          <div className="flex items-center gap-2 sm:gap-3 bg-[#161412] p-2 sm:p-3.5 rounded-lg sm:rounded-xl border border-[#D4AF37]/15 hover:border-[#D4AF37]/40 transition-colors">
            <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Check className="w-3 h-3 sm:hidden" />
              <Bath className="hidden sm:block w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="font-semibold block text-[#F7F5F2] text-xs sm:text-sm font-serif truncate">Two Towels</span>
              <span className="hidden sm:block text-[11px] text-[#D6B892]/70">Freshly sanitized plush bath towels</span>
            </div>
          </div>

          {/* 2. Mattress */}
          <div className="flex items-center gap-2 sm:gap-3 bg-[#161412] p-2 sm:p-3.5 rounded-lg sm:rounded-xl border border-[#D4AF37]/15 hover:border-[#D4AF37]/40 transition-colors">
            <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Check className="w-3 h-3 sm:hidden" />
              <BedDouble className="hidden sm:block w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="font-semibold block text-[#F7F5F2] text-xs sm:text-sm font-serif truncate">Mattress</span>
              <span className="hidden sm:block text-[11px] text-[#D6B892]/70">Comfort orthopedic sleeping mattress</span>
            </div>
          </div>

          {/* 3. Blanket */}
          <div className="flex items-center gap-2 sm:gap-3 bg-[#161412] p-2 sm:p-3.5 rounded-lg sm:rounded-xl border border-[#D4AF37]/15 hover:border-[#D4AF37]/40 transition-colors">
            <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Check className="w-3 h-3 sm:hidden" />
              <Layers className="hidden sm:block w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="font-semibold block text-[#F7F5F2] text-xs sm:text-sm font-serif truncate">Blanket</span>
              <span className="hidden sm:block text-[11px] text-[#D6B892]/70">Cozy warm all-season blanket</span>
            </div>
          </div>

          {/* 4. Pillow */}
          <div className="flex items-center gap-2 sm:gap-3 bg-[#161412] p-2 sm:p-3.5 rounded-lg sm:rounded-xl border border-[#D4AF37]/15 hover:border-[#D4AF37]/40 transition-colors">
            <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Check className="w-3 h-3 sm:hidden" />
              <Moon className="hidden sm:block w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="font-semibold block text-[#F7F5F2] text-xs sm:text-sm font-serif truncate">Pillows</span>
              <span className="hidden sm:block text-[11px] text-[#D6B892]/70">Soft head rest & sleep support</span>
            </div>
          </div>

          {/* 5. Bedsheet */}
          <div className="flex items-center gap-2 sm:gap-3 bg-[#161412] p-2 sm:p-3.5 rounded-lg sm:rounded-xl border border-[#D4AF37]/15 hover:border-[#D4AF37]/40 transition-colors">
            <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Check className="w-3 h-3 sm:hidden" />
              <Sparkles className="hidden sm:block w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="font-semibold block text-[#F7F5F2] text-xs sm:text-sm font-serif truncate">Bedsheet</span>
              <span className="hidden sm:block text-[11px] text-[#D6B892]/70">Crisp clean cotton bed linen</span>
            </div>
          </div>

          {/* 6. Shampoo */}
          <div className="flex items-center gap-2 sm:gap-3 bg-[#161412] p-2 sm:p-3.5 rounded-lg sm:rounded-xl border border-[#D4AF37]/15 hover:border-[#D4AF37]/40 transition-colors">
            <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Check className="w-3 h-3 sm:hidden" />
              <Droplets className="hidden sm:block w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="font-semibold block text-[#F7F5F2] text-xs sm:text-sm font-serif truncate">Shampoo</span>
              <span className="hidden sm:block text-[11px] text-[#D6B892]/70">Herbal botanical hair cleanser</span>
            </div>
          </div>

          {/* 7. Shower Gel */}
          <div className="flex items-center gap-2 sm:gap-3 bg-[#161412] p-2 sm:p-3.5 rounded-lg sm:rounded-xl border border-[#D4AF37]/15 hover:border-[#D4AF37]/40 transition-colors">
            <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Check className="w-3 h-3 sm:hidden" />
              <Bath className="hidden sm:block w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="font-semibold block text-[#F7F5F2] text-xs sm:text-sm font-serif truncate">Shower Gel</span>
              <span className="hidden sm:block text-[11px] text-[#D6B892]/70">Refreshing luxury bath body wash</span>
            </div>
          </div>

          {/* 8. Kettle */}
          <div className="flex items-center gap-2 sm:gap-3 bg-[#161412] p-2 sm:p-3.5 rounded-lg sm:rounded-xl border border-[#D4AF37]/15 hover:border-[#D4AF37]/40 transition-colors">
            <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Check className="w-3 h-3 sm:hidden" />
              <Coffee className="hidden sm:block w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="font-semibold block text-[#F7F5F2] text-xs sm:text-sm font-serif truncate">Electric Kettle</span>
              <span className="hidden sm:block text-[11px] text-[#D6B892]/70">In-room fast boiling water & tea kettle</span>
            </div>
          </div>

          {/* 9. Water Bottle */}
          <div className="flex items-center gap-2 sm:gap-3 bg-[#161412] p-2 sm:p-3.5 rounded-lg sm:rounded-xl border border-[#D4AF37]/15 hover:border-[#D4AF37]/40 transition-colors col-span-2 sm:col-span-1">
            <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Check className="w-3 h-3 sm:hidden" />
              <GlassWater className="hidden sm:block w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="font-semibold block text-[#F7F5F2] text-xs sm:text-sm font-serif truncate">Water Bottle</span>
              <span className="hidden sm:block text-[11px] text-[#D6B892]/70">Complimentary packaged mineral water</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Fullscreen Photo Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-6 bg-black/95 backdrop-blur-2xl animate-fadeIn">
          <div
            className="fixed inset-0 cursor-pointer"
            onClick={() => setIsLightboxOpen(false)}
          />

          <div
            className="relative z-10 w-full max-w-5xl max-h-[96vh] sm:max-h-[92vh] bg-[#100F0E] border border-[#D4AF37]/40 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-[#D4AF37]/20 flex items-center justify-between bg-[#161412]">
              <div className="min-w-0 pr-2">
                <span className="text-[9px] sm:text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block">
                  PALACE PHOTO GALLERY
                </span>
              </div>

              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-1.5 sm:p-2 rounded-full border border-[#D4AF37]/30 text-[#D6B892] hover:bg-[#D4AF37] hover:text-[#100F0E] transition-all cursor-pointer shrink-0"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Lightbox Main Image Display */}
            <div className="relative flex-1 min-h-[250px] xs:min-h-[320px] sm:min-h-[500px] w-full bg-black flex items-center justify-center">
              <Image
                key={currentImage}
                src={currentImage}
                alt={`${roomName} Full View`}
                fill
                className="object-contain"
                priority
              />

              <button
                type="button"
                onClick={handlePrevImg}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/70 hover:bg-[#D4AF37] hover:text-[#100F0E] text-[#F7F5F2] border border-[#D4AF37]/40 flex items-center justify-center transition-all cursor-pointer shadow-2xl hover:scale-110"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                type="button"
                onClick={handleNextImg}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/70 hover:bg-[#D4AF37] hover:text-[#100F0E] text-[#F7F5F2] border border-[#D4AF37]/40 flex items-center justify-center transition-all cursor-pointer shadow-2xl hover:scale-110"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Lightbox Thumbnails Footer */}
            <div className="p-3 sm:p-4 bg-[#141210] border-t border-[#D4AF37]/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none touch-pan-x">
                {galleryImages.map((imgSrc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImgIndex(idx)}
                    className={`relative shrink-0 w-14 sm:w-20 h-10 sm:h-14 rounded overflow-hidden transition-all cursor-pointer ${activeImgIndex === idx
                      ? "ring-2 ring-[#D4AF37] border-2 border-[#D4AF37] scale-105"
                      : "opacity-50 hover:opacity-100 border border-white/20"
                      }`}
                  >
                    <Image src={imgSrc} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    openLoginModal({ autoOpenBooking: true, room: normalizedRoom });
                    return;
                  }
                  setIsLightboxOpen(false);
                  startBookingForRoom(normalizedRoom);
                }}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#C9A86A] via-[#D4AF37] to-[#C9A86A] text-[#100F0E] text-xs font-serif uppercase tracking-widest font-bold rounded shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105 transition-all shrink-0 cursor-pointer text-center"
              >
                Book This Room
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


