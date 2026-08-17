"use client";

import { X, Utensils, Clock, Wine, Star, ArrowRight } from "lucide-react";

export default function DiningModal({ isOpen, onClose, onOpenBooking }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 lg:p-10 bg-[#0A0908]/92 backdrop-blur-2xl animate-fadeIn cursor-pointer"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[85vh] sm:max-h-[90vh] bg-[#100F0E] border border-[#D4AF37]/35 rounded-xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 lg:p-8 border-b border-[#D4AF37]/20 flex items-center justify-between bg-[#161412]/80 backdrop-blur-md">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#D4AF37] uppercase font-semibold">
              ROYAL REGAL CUISINE
            </span>
            <h2 className="font-serif text-2xl lg:text-4xl text-[#F7F5F2] font-normal tracking-wide">
              Palace Dining & Courtyard Feasts
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full border border-[#D4AF37]/30 text-[#D6B892] hover:bg-[#D4AF37] hover:text-[#100F0E] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div
          className="p-6 lg:p-8 overflow-y-auto space-y-8 flex-1 touch-pan-y overscroll-contain"
          data-lenis-prevent
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {/* Main Hero Card */}
          <div className="bg-[#161412] border border-[#D4AF37]/25 rounded-lg p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block">
                SIGNATURE RESTAURANT
              </span>
              <h3 className="font-serif text-3xl text-[#F7F5F2] font-normal">
                Shahi Darbar Dining Hall
              </h3>
              <p className="text-xs text-[#D6B892]/80 font-sans leading-relaxed">
                Step beneath hand-painted ceiling frescoes and sparkling chandeliers. Shahi Darbar serves authentic centuries-old royal Indian recipes, charcoal-grilled tandoori delicacies, and fine international cellared wines.
              </p>

              <div className="space-y-2 pt-2 text-xs text-[#D6B892]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#D4AF37]" />
                  <span>Breakfast: 7:00 AM – 10:30 AM | Dinner: 7:00 PM – 11:00 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wine className="w-4 h-4 text-[#D4AF37]" />
                  <span>Sommelier Selection & Som-Bar Pairings</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-[#100F0E] border border-[#D4AF37]/20 p-6 rounded-md">
              <h4 className="font-serif text-base text-[#F7F5F2] uppercase tracking-wider mb-2 flex items-center gap-2">
                <Star className="w-4 h-4 text-[#D4AF37]" />
                <span>SIGNATURE TASTING COURSES</span>
              </h4>
              <ul className="space-y-3 text-xs text-[#D6B892]/90">
                <li className="flex justify-between border-b border-[#D4AF37]/10 pb-2">
                  <span className="font-semibold text-[#F7F5F2]">Rajmahal Shahi Thali</span>
                  <span className="text-[#D4AF37] font-mono">$65</span>
                </li>
                <li className="flex justify-between border-b border-[#D4AF37]/10 pb-2">
                  <span className="font-semibold text-[#F7F5F2]">Laal Maas & Truffle Naan</span>
                  <span className="text-[#D4AF37] font-mono">$48</span>
                </li>
                <li className="flex justify-between border-b border-[#D4AF37]/10 pb-2">
                  <span className="font-semibold text-[#F7F5F2]">Private Terrace Candlelight Feast</span>
                  <span className="text-[#D4AF37] font-mono">$180</span>
                </li>
              </ul>

              <button
                onClick={() => {
                  onClose();
                  if (onOpenBooking) onOpenBooking();
                }}
                className="w-full mt-4 py-3 bg-[#D4AF37] text-[#100F0E] text-xs font-serif uppercase tracking-[0.2em] font-semibold rounded-sm hover:bg-[#C9A86A] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Reserve Dining Table</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
