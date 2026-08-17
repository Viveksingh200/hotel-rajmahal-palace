"use client";

import React from "react";
import { Calendar as CalendarIcon, Users, DoorClosed, Search } from "lucide-react";
import { useBooking } from "@/context/BookingContext";

export default function BookingWidget() {
  const {
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    guests,
    setGuests,
    roomsCount,
    setRoomsCount,
    searchAvailableRooms,
  } = useBooking();

  const handleSearch = (e) => {
    e.preventDefault();
    searchAvailableRooms(checkIn, checkOut, guests, roomsCount);
  };

  return (
    <div className="relative z-30 max-w-6xl mx-auto px-4 -mt-12 sm:-mt-16 mb-16">
      <div className="bg-charcoal text-cream rounded-lg p-4 sm:p-6 shadow-2xl border border-gold/30 backdrop-blur-md">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Check-In */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs uppercase tracking-widest text-gold font-medium flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Check-In</span>
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="bg-charcoal-light border border-white/20 focus:border-gold rounded-sm px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
              required
            />
          </div>

          {/* Check-Out */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs uppercase tracking-widest text-gold font-medium flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Check-Out</span>
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="bg-charcoal-light border border-white/20 focus:border-gold rounded-sm px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
              required
            />
          </div>

          {/* Guests & Rooms */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs uppercase tracking-widest text-gold font-medium flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>Guests</span>
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="bg-charcoal-light border border-white/20 focus:border-gold rounded-sm px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
              >
                <option value={1}>1 Guest</option>
                <option value={2}>2 Guests</option>
                <option value={3}>3 Guests</option>
                <option value={4}>4 Guests</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs uppercase tracking-widest text-gold font-medium flex items-center gap-1">
                <DoorClosed className="w-3.5 h-3.5" />
                <span>Rooms</span>
              </label>
              <select
                value={roomsCount}
                onChange={(e) => setRoomsCount(Number(e.target.value))}
                className="bg-charcoal-light border border-white/20 focus:border-gold rounded-sm px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
              >
                <option value={1}>1 Room</option>
                <option value={2}>2 Rooms</option>
                <option value={3}>3 Rooms</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-sandstone hover:bg-sandstone-dark text-cream font-serif text-sm tracking-widest py-3 px-6 rounded-sm border border-gold/40 hover:border-gold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <Search className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
              <span>SEARCH ROOMS</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
