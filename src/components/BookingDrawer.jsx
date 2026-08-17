"use client";

import { useState, useEffect } from "react";
import { X, Calendar, Users, Crown, CheckCircle, Tag, ArrowRight, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { ROOMS_DATA } from "@/data/rooms";

export default function BookingDrawer({ isOpen, onClose, initialSuite = null }) {
  const [selectedRoomId, setSelectedRoomId] = useState(initialSuite?.id || ROOMS_DATA[0].id);
  const [checkIn, setCheckIn] = useState("2026-09-01");
  const [checkOut, setCheckOut] = useState("2026-09-04");
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  useEffect(() => {
    if (initialSuite?.id) {
      setSelectedRoomId(initialSuite.id);
    }
  }, [initialSuite]);

  if (!isOpen) return null;

  const room = ROOMS_DATA.find((r) => r.id === selectedRoomId) || ROOMS_DATA[0];

  // Calculate nights
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.max(1, Math.abs(end - start));
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  const roomRate = room.pricePerNight * nights;
  const taxes = Math.round(roomRate * 0.18); // 18% GST / luxury tax
  const discount = discountApplied ? Math.round(roomRate * 0.15) : 0; // 15% promo discount
  const totalAmount = roomRate + taxes - discount;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "PALACE10" || promoCode.trim().toUpperCase() === "ROYALVIP") {
      setDiscountApplied(true);
    } else {
      alert("Invalid promo code. Try 'PALACE10' or 'ROYALVIP'");
    }
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Trigger golden confetti celebration
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D4AF37", "#C9A86A", "#ffffff", "#e6c875"],
      });
    } catch (err) {
      console.log("Confetti trigger:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[150] flex justify-end bg-black/80 backdrop-blur-md animate-fadeIn cursor-pointer"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg h-full bg-[#100F0E] border-l border-[#D4AF37]/30 shadow-2xl flex flex-col justify-between overflow-y-auto cursor-default touch-pan-y"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        {/* Header */}
        <div className="p-6 border-b border-[#D4AF37]/20 flex items-center justify-between bg-[#161412]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] text-[#D4AF37] uppercase font-semibold">
                RESERVE YOUR STAY
              </span>
              <h2 className="font-serif text-xl text-[#F7F5F2] font-semibold">
                Hotel Rajmahal Palace
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full border border-[#D4AF37]/30 text-[#D6B892] hover:bg-[#D4AF37] hover:text-[#100F0E] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isSubmitted ? (
          <div className="p-8 text-center flex flex-col items-center justify-center flex-1 space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.4)]">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold block mb-1">
                RESERVATION CONFIRMED
              </span>
              <h3 className="font-serif text-3xl text-[#F7F5F2] font-semibold">
                Welcome to Rajmahal Palace!
              </h3>
              <p className="text-xs text-[#D6B892]/80 font-sans mt-3 max-w-sm leading-relaxed">
                Thank you, <strong className="text-[#F7F5F2]">{guestName || "Estemeed Guest"}</strong>. Your reservation for <strong className="text-[#D4AF37]">{room.name}</strong> ({nights} Nights) has been confirmed. A confirmation receipt has been sent to {guestEmail || "your email"}.
              </p>
            </div>

            <div className="w-full bg-[#161412] border border-[#D4AF37]/25 rounded-md p-4 text-xs text-left space-y-2 text-[#D6B892]">
              <div className="flex justify-between border-b border-[#D4AF37]/15 pb-1.5">
                <span>Check-In Date</span>
                <span className="font-semibold text-[#F7F5F2]">{checkIn}</span>
              </div>
              <div className="flex justify-between border-b border-[#D4AF37]/15 pb-1.5">
                <span>Check-Out Date</span>
                <span className="font-semibold text-[#F7F5F2]">{checkOut}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Total Paid</span>
                <span className="font-serif text-[#D4AF37] font-semibold text-base">${totalAmount}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsSubmitted(false);
                onClose();
              }}
              className="w-full py-3.5 bg-[#D4AF37] text-[#100F0E] text-xs font-serif uppercase tracking-[0.2em] font-semibold rounded-sm hover:bg-[#C9A86A] transition-colors cursor-pointer"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitBooking} className="p-6 space-y-6 flex-1">
            {/* Select Room Category */}
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] block mb-2">
                1. SELECT PALACE SUITE
              </label>
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="w-full bg-[#161412] border border-[#D4AF37]/35 rounded px-3 py-3 text-xs font-serif text-[#F7F5F2] focus:outline-none focus:border-[#D4AF37] cursor-pointer"
              >
                {ROOMS_DATA.map((r) => (
                  <option key={r.id} value={r.id} className="bg-[#100F0E] text-[#F7F5F2]">
                    {r.name} — ${r.pricePerNight}/night ({r.sizeSqFt} sq ft)
                  </option>
                ))}
              </select>
            </div>

            {/* Dates Selection */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#D6B892]/70 block mb-1">
                  CHECK-IN
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-[#161412] border border-[#D4AF37]/30 rounded px-3 py-2.5 text-xs text-[#F7F5F2] font-mono focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#D6B892]/70 block mb-1">
                  CHECK-OUT
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-[#161412] border border-[#D4AF37]/30 rounded px-3 py-2.5 text-xs text-[#F7F5F2] font-mono focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>
            </div>

            {/* Guests Count */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#D6B892]/70 block mb-1">
                  ADULTS
                </label>
                <select
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="w-full bg-[#161412] border border-[#D4AF37]/30 rounded px-3 py-2 text-xs text-[#F7F5F2] font-mono"
                >
                  <option value={1}>1 Adult</option>
                  <option value={2}>2 Adults</option>
                  <option value={3}>3 Adults</option>
                  <option value={4}>4 Adults</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#D6B892]/70 block mb-1">
                  CHILDREN
                </label>
                <select
                  value={childrenCount}
                  onChange={(e) => setChildrenCount(Number(e.target.value))}
                  className="w-full bg-[#161412] border border-[#D4AF37]/30 rounded px-3 py-2 text-xs text-[#F7F5F2] font-mono"
                >
                  <option value={0}>0 Children</option>
                  <option value={1}>1 Child</option>
                  <option value={2}>2 Children</option>
                </select>
              </div>
            </div>

            {/* Guest Details */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] block">
                2. GUEST INFORMATION
              </label>
              <input
                type="text"
                placeholder="Full Name (e.g. Maharaja Vikram Singh)"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full bg-[#161412] border border-[#D4AF37]/30 rounded px-3 py-2.5 text-xs text-[#F7F5F2] focus:outline-none focus:border-[#D4AF37]"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="w-full bg-[#161412] border border-[#D4AF37]/30 rounded px-3 py-2.5 text-xs text-[#F7F5F2] focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>

            {/* Promo Code Input */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#D6B892]/70 block mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3 text-[#D4AF37]" />
                PROMO CODE (Try: PALACE10 or ROYALVIP)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="PALACE10"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={discountApplied}
                  className="flex-1 bg-[#161412] border border-[#D4AF37]/30 rounded px-3 py-2 text-xs text-[#F7F5F2] uppercase font-mono"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  disabled={discountApplied}
                  className="px-4 py-2 bg-[#1A1816] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-serif uppercase tracking-wider rounded hover:bg-[#D4AF37] hover:text-[#100F0E] transition-colors cursor-pointer"
                >
                  {discountApplied ? "Applied!" : "Apply"}
                </button>
              </div>
            </div>

            {/* Total Cost Summary */}
            <div className="bg-[#161412] border border-[#D4AF37]/30 rounded p-4 space-y-2 text-xs text-[#D6B892]">
              <div className="flex justify-between">
                <span>Rate ({nights} Nights)</span>
                <span>${roomRate}</span>
              </div>
              <div className="flex justify-between">
                <span>Heritage Taxes & GST (18%)</span>
                <span>${taxes}</span>
              </div>
              {discountApplied && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Royal Promo Discount (15%)</span>
                  <span>-${discount}</span>
                </div>
              )}
              <div className="border-t border-[#D4AF37]/20 pt-2 flex justify-between items-baseline font-serif text-base text-[#F7F5F2]">
                <span>Grand Total</span>
                <span className="text-[#D4AF37] font-semibold text-xl">${totalAmount}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-[#C9A86A] via-[#D4AF37] to-[#C9A86A] text-[#100F0E] text-xs font-serif uppercase tracking-[0.25em] font-semibold rounded shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>CONFIRM RESERVATION</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
