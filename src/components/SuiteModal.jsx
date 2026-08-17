"use client";

import { X, BedDouble, Maximize, Users, ArrowRight, ShieldCheck } from "lucide-react";
import { ROOMS_DATA } from "@/data/rooms";

export default function SuiteModal({ isOpen, onClose, onSelectSuite }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 lg:p-10 bg-[#0A0908]/92 backdrop-blur-2xl animate-fadeIn cursor-pointer"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="relative w-full max-w-6xl max-h-[85vh] sm:max-h-[90vh] bg-[#100F0E] border border-[#D4AF37]/35 rounded-xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col cursor-default"
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
            className="p-2.5 rounded-full border border-[#D4AF37]/30 text-[#D6B892] hover:bg-[#D4AF37] hover:text-[#100F0E] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Card Grid Body (Card Structure like Spa Section) */}
        <div
          className="p-6 lg:p-8 overflow-y-auto space-y-6 flex-1 touch-pan-y overscroll-contain"
          data-lenis-prevent
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <p className="text-xs sm:text-sm text-[#D6B892]/80 font-sans leading-relaxed">
            Select your preferred heritage room or presidential suite. Each accommodation is crafted with dark charcoal marble, teakwood joinery, and private balconies overlooking mountain slopes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ROOMS_DATA.map((room) => (
              <div
                key={room.id}
                className="bg-[#161412] border border-[#D4AF37]/25 rounded-lg p-6 flex flex-col justify-between hover:border-[#D4AF37] transition-all shadow-xl group space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase block mb-1">
                        {room.view}
                      </span>
                      <h3 className="font-serif text-2xl text-[#F7F5F2] font-semibold group-hover:text-[#D4AF37] transition-colors">
                        {room.name}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs font-serif italic text-[#D6B892]/90">
                    &ldquo;{room.tagline}&rdquo;
                  </p>

                  <p className="text-xs text-[#D6B892]/75 font-sans leading-relaxed line-clamp-2">
                    {room.description}
                  </p>

                  {/* Specs Pills */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#D4AF37]/15 text-[11px] text-[#D6B892]">
                    <div className="flex items-center gap-1.5">
                      <Maximize className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{room.sizeSqFt} Sq Ft</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{room.maxGuests} Guests</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BedDouble className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span className="truncate">{room.bedType.split(" ")[0]} Bed</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer (Price & Direct Book Button) */}
                <div className="pt-2 flex items-center justify-between border-t border-[#D4AF37]/10">
                  <div>
                    <span className="text-[10px] font-mono text-[#D6B892]/60 uppercase block">PER NIGHT</span>
                    <span className="font-serif text-2xl text-[#D4AF37] font-semibold">
                      {room.currency}{room.pricePerNight}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      if (onSelectSuite) onSelectSuite(room);
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-[#C9A86A] via-[#D4AF37] to-[#C9A86A] text-[#100F0E] text-xs font-serif uppercase tracking-[0.15em] font-semibold rounded-sm shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Book Room</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
