"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Calendar as CalendarIcon, Users, Clock, Search } from "lucide-react";
import { useBooking } from "@/context/BookingContext";

const ALL_TIME_OPTIONS = [
  "12:00 AM", "1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM",
  "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
  "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM"
];

export default function BookingWidget() {
  const router = useRouter();
  const pathname = usePathname();

  const {
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    bookingTime,
    setBookingTime,
    guests,
    setGuests,
    roomsCount,
    setRoomsCount,
    searchAvailableRooms,
    openBookingDrawer,
    refreshAvailableRooms,
  } = useBooking();

  const today = new Date().toISOString().split("T")[0];

  const getMinCheckOut = (checkInDate) => {
    if (!checkInDate) return today;
    const d = new Date(checkInDate);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const handleCheckInChange = (newDate) => {
    setCheckIn(newDate);
    if (!checkOut || checkOut <= newDate) {
      setCheckOut(getMinCheckOut(newDate));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (checkIn < today) {
      alert("Check-in date cannot be in the past.");
      return;
    }
    if (checkOut <= checkIn) {
      alert("Check-out date must be after check-in date.");
      return;
    }
    searchAvailableRooms(checkIn, checkOut, guests, roomsCount);
    if (refreshAvailableRooms) {
      refreshAvailableRooms();
    }
    openBookingDrawer();
  };

  return (
    <div className="relative z-20 max-w-6xl mx-auto px-2 sm:px-4 my-6 sm:my-9">
      <div className="bg-charcoal text-cream rounded-xl sm:rounded-lg p-4 sm:p-6 shadow-2xl border border-gold/30 backdrop-blur-md">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 items-end">
          {/* Check-In */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs uppercase tracking-widest text-gold font-medium flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Check-In</span>
              </span>
              <span className="text-[10px] text-cream/70 font-mono">12:00 PM</span>
            </label>
            <input
              type="date"
              min={today}
              value={checkIn}
              onChange={(e) => handleCheckInChange(e.target.value)}
              className="w-full bg-charcoal-light border border-gold/40 focus:border-gold rounded-sm px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-gold transition-colors cursor-pointer"
              required
            />
          </div>

          {/* Check-Out */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs uppercase tracking-widest text-gold font-medium flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Check-Out</span>
              </span>
              <span className="text-[10px] text-cream/70 font-mono">10:00 AM</span>
            </label>
            <input
              type="date"
              min={getMinCheckOut(checkIn)}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-charcoal-light border border-gold/40 focus:border-gold rounded-sm px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-gold transition-colors cursor-pointer"
              required
            />
          </div>

          {/* Guests */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs uppercase tracking-widest text-gold font-medium flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>Guests</span>
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full bg-charcoal-light border border-white/20 focus:border-gold rounded-sm px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gold transition-colors cursor-pointer"
            >
              <option value={1}>1 Guest</option>
              <option value={2}>2 Guests</option>
              <option value={3}>3 Guests</option>
              <option value={4}>4 Guests</option>
              <option value={5}>5 Guests</option>
              <option value={6}>6 Guests</option>
              <option value={7}>7 Guests</option>
            </select>
          </div>

          {/* Timing */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs uppercase tracking-widest text-gold font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Timing</span>
            </label>
            <select
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
              className="w-full bg-charcoal-light border border-white/20 focus:border-gold rounded-sm px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-gold transition-colors cursor-pointer"
            >
              {ALL_TIME_OPTIONS.map((slot) => (
                <option key={slot} value={slot} className="bg-[#100F0E] text-white">
                  {slot}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-2 lg:col-span-1">
            <button
              type="submit"
              data-cursor="RESERVE"
              className="w-full bg-gradient-to-r from-[#C9A86A] via-[#D4AF37] to-[#C9A86A] text-[#100F0E] font-serif text-sm font-bold tracking-widest py-3 sm:py-3.5 px-4 rounded-sm border border-gold/40 shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:shadow-[0_0_35px_rgba(212,175,55,0.6)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <CalendarIcon className="w-4 h-4 text-[#100F0E] group-hover:scale-110 transition-transform" />
              <span>BOOK NOW</span>
            </button>
          </div>
        </form>

        {/* 22-Hour Policy & Non-Refundable Tagline */}
        <div className="pt-3 mt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 text-[11px] font-sans text-cream/70">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="flex items-center gap-1.5 text-gold font-serif">
              <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
              <span>22-Hour Stay Policy</span>
            </span>
            <span className="text-white/20">•</span>
            <span className="text-[#E6C875] font-serif font-medium tracking-wide">
              Non-Refundable Booking
            </span>
          </div>
          <span>Check-in: <strong className="text-white font-mono">12:00 PM Noon</strong> • Check-out: <strong className="text-white font-mono">10:00 AM Morning</strong></span>
        </div>
      </div>
    </div>
  );
}
