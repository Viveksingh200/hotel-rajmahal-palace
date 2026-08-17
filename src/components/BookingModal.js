"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useBooking } from "@/context/BookingContext";
import { ROOMS_DATA } from "@/data/rooms";
import {
  X,
  Calendar as CalendarIcon,
  Users,
  Check,
  BedDouble,
  ArrowRight,
  Printer,
  Home,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BookingModal() {
  const {
    isBookingModalOpen,
    closeBookingModal,
    bookingStep,
    setBookingStep,
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    guests,
    setGuests,
    roomsCount,
    setRoomsCount,
    selectedRoom,
    setSelectedRoom,
    guestInfo,
    setGuestInfo,
    completedBooking,
    confirmBooking,
    resetBooking,
    nights,
    roomSubtotal,
    taxesAndFees,
    grandTotal,
  } = useBooking();

  const [validationError, setValidationError] = useState("");

  // Trigger celebratory confetti when confirmation opens
  useEffect(() => {
    if (bookingStep === "confirmation" && completedBooking) {
      import("canvas-confetti").then((confettiModule) => {
        const confetti = confettiModule.default;
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#c5a059", "#933d2d", "#ffffff"],
        });
      }).catch((err) => console.log("Confetti error:", err));
    }
  }, [bookingStep, completedBooking]);

  if (!isBookingModalOpen) return null;

  const handleGuestInfoSubmit = (e) => {
    e.preventDefault();
    if (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.phone) {
      setValidationError("Please fill out all required guest details.");
      return;
    }
    setValidationError("");
    setBookingStep("summary");
  };

  const handlePrintConfirmation = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-cream text-charcoal w-full max-w-4xl rounded-lg shadow-2xl border border-gold/40 overflow-hidden relative my-8 print:shadow-none print:border-none print:max-w-none"
      >
        {/* Header Bar */}
        <div className="bg-charcoal text-cream p-5 sm:p-6 flex items-center justify-between border-b border-gold/30 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-sandstone flex items-center justify-center text-gold border border-gold/40">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold block font-medium">
                HOTEL RAJMAHAL PALACE
              </span>
              <h3 className="text-xl sm:text-2xl font-serif text-white">
                {bookingStep === "available" && "Select Available Rooms"}
                {bookingStep === "details" && "Guest Information"}
                {bookingStep === "summary" && "Review & Confirm Booking"}
                {bookingStep === "confirmation" && "Booking Confirmed!"}
              </h3>
            </div>
          </div>

          <button
            onClick={closeBookingModal}
            className="p-2 rounded-full hover:bg-white/10 text-cream/80 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step Progress Tracker */}
        {bookingStep !== "confirmation" && (
          <div className="bg-cream-muted border-b border-sandstone/15 px-6 py-3 flex items-center justify-between text-xs font-serif uppercase tracking-wider print:hidden">
            <span className={bookingStep === "available" ? "text-sandstone font-bold" : "text-charcoal/50"}>
              1. Rooms
            </span>
            <span className="text-charcoal/30">→</span>
            <span className={bookingStep === "details" ? "text-sandstone font-bold" : "text-charcoal/50"}>
              2. Details
            </span>
            <span className="text-charcoal/30">→</span>
            <span className={bookingStep === "summary" ? "text-sandstone font-bold" : "text-charcoal/50"}>
              3. Summary
            </span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* STEP 1: AVAILABLE ROOMS */}
          {bookingStep === "available" && (
            <div className="space-y-6">
              {/* Dates Bar */}
              <div className="bg-charcoal text-cream p-4 rounded-md grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-gold block font-serif">Check-In</span>
                  <span className="font-mono text-sm">{checkIn}</span>
                </div>
                <div>
                  <span className="text-gold block font-serif">Check-Out</span>
                  <span className="font-mono text-sm">{checkOut}</span>
                </div>
                <div>
                  <span className="text-gold block font-serif">Stay Duration</span>
                  <span className="text-sm">{nights} Night(s)</span>
                </div>
                <div>
                  <span className="text-gold block font-serif">Occupancy</span>
                  <span className="text-sm">{guests} Guests, {roomsCount} Room</span>
                </div>
              </div>

              <h4 className="text-lg font-serif text-charcoal border-b border-sandstone/15 pb-2">
                Available Mock Accommodations ({checkIn} – {checkOut})
              </h4>

              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                {ROOMS_DATA.map((room) => {
                  const isSelected = selectedRoom?.id === room.id;
                  return (
                    <div
                      key={room.id}
                      className={`p-4 rounded-lg border transition-all duration-300 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center ${
                        isSelected
                          ? "bg-sandstone/10 border-sandstone shadow-md"
                          : "bg-white border-sandstone/15 hover:border-gold"
                      }`}
                    >
                      <div className="sm:col-span-4 relative h-32 rounded overflow-hidden">
                        <Image src={room.featuredImage} alt={room.name} fill className="object-cover" />
                      </div>

                      <div className="sm:col-span-5 space-y-1">
                        <h5 className="text-lg font-serif text-charcoal">{room.name}</h5>
                        <p className="text-xs text-charcoal/70 line-clamp-2">{room.description}</p>
                        <div className="flex items-center gap-3 text-xs text-sandstone font-medium pt-1">
                          <span>{room.maxGuests} Guests</span>
                          <span>•</span>
                          <span>{room.sizeSqFt} Sq Ft</span>
                          <span>•</span>
                          <span>{room.view.split(" ")[0]} View</span>
                        </div>
                      </div>

                      <div className="sm:col-span-3 text-right flex flex-col justify-between items-end gap-2">
                        <div>
                          <span className="text-xs text-charcoal/60 block">Price / Night</span>
                          <span className="text-xl font-serif text-sandstone font-bold">
                            {room.currency}{room.pricePerNight}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedRoom(room);
                            setBookingStep("details");
                          }}
                          className="bg-sandstone hover:bg-sandstone-dark text-cream font-serif text-xs tracking-wider uppercase px-4 py-2 rounded border border-gold/30 flex items-center gap-1"
                        >
                          <span>SELECT ROOM</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: GUEST DETAILS */}
          {bookingStep === "details" && (
            <form onSubmit={handleGuestInfoSubmit} className="space-y-6">
              <div className="bg-cream-muted p-4 rounded border border-sandstone/15 flex items-center justify-between">
                <div>
                  <span className="text-xs text-sandstone uppercase font-serif block">Selected Accomodation</span>
                  <h4 className="text-lg font-serif text-charcoal">{selectedRoom.name}</h4>
                  <p className="text-xs text-charcoal/70">
                    {checkIn} to {checkOut} ({nights} Nights) — ${selectedRoom.pricePerNight} / night
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setBookingStep("available")}
                  className="text-xs text-sandstone underline font-serif"
                >
                  Change Room
                </button>
              </div>

              {validationError && (
                <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-xs rounded">
                  {validationError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-serif uppercase tracking-wider text-charcoal">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={guestInfo.firstName}
                    onChange={(e) => setGuestInfo({ ...guestInfo, firstName: e.target.value })}
                    className="w-full bg-white border border-sandstone/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-sandstone"
                    placeholder="e.g. Maharani"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-serif uppercase tracking-wider text-charcoal">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={guestInfo.lastName}
                    onChange={(e) => setGuestInfo({ ...guestInfo, lastName: e.target.value })}
                    className="w-full bg-white border border-sandstone/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-sandstone"
                    placeholder="e.g. Singh"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-serif uppercase tracking-wider text-charcoal">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={guestInfo.email}
                    onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                    className="w-full bg-white border border-sandstone/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-sandstone"
                    placeholder="guest@example.com"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-serif uppercase tracking-wider text-charcoal">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={guestInfo.phone}
                    onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                    className="w-full bg-white border border-sandstone/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-sandstone"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-serif uppercase tracking-wider text-charcoal">
                  Special Requests / Dietary Preferences
                </label>
                <textarea
                  value={guestInfo.specialRequests}
                  onChange={(e) => setGuestInfo({ ...guestInfo, specialRequests: e.target.value })}
                  rows={3}
                  className="w-full bg-white border border-sandstone/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-sandstone"
                  placeholder="High floor, quiet balcony, early check-in, dietary preferences, etc."
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-sandstone/15">
                <button
                  type="button"
                  onClick={() => setBookingStep("available")}
                  className="text-xs font-serif text-charcoal/70 uppercase tracking-wider px-4 py-2"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-sandstone hover:bg-sandstone-dark text-cream font-serif text-xs tracking-widest uppercase px-6 py-3 rounded border border-gold/40 flex items-center gap-2"
                >
                  <span>PROCEED TO SUMMARY</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SUMMARY */}
          {bookingStep === "summary" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left: Summary Details */}
                <div className="md:col-span-7 space-y-4">
                  <div className="bg-white p-5 rounded-lg border border-sandstone/20 space-y-3">
                    <h5 className="text-sm font-serif uppercase tracking-wider text-sandstone border-b border-sandstone/10 pb-2">
                      Guest & Stay Reservation
                    </h5>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-charcoal/60 block">Primary Guest</span>
                        <span className="font-semibold text-charcoal">
                          {guestInfo.firstName} {guestInfo.lastName}
                        </span>
                      </div>
                      <div>
                        <span className="text-charcoal/60 block">Contact</span>
                        <span className="font-semibold text-charcoal">{guestInfo.email}</span>
                      </div>
                      <div>
                        <span className="text-charcoal/60 block">Dates</span>
                        <span className="font-semibold text-charcoal">
                          {checkIn} to {checkOut}
                        </span>
                      </div>
                      <div>
                        <span className="text-charcoal/60 block">Duration</span>
                        <span className="font-semibold text-charcoal">{nights} Nights</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg border border-sandstone/20 space-y-2">
                    <h5 className="text-sm font-serif uppercase tracking-wider text-sandstone border-b border-sandstone/10 pb-2">
                      Selected Accomodation
                    </h5>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-charcoal text-base font-serif">
                        {selectedRoom.name}
                      </span>
                      <span className="text-sandstone font-bold">${selectedRoom.pricePerNight} / night</span>
                    </div>
                    <p className="text-xs text-charcoal/70">{selectedRoom.description}</p>
                  </div>
                </div>

                {/* Right: Billing Breakdown */}
                <div className="md:col-span-5 bg-charcoal text-cream p-6 rounded-lg border border-gold/30 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h5 className="text-xs uppercase tracking-widest text-gold font-serif border-b border-white/10 pb-2">
                      PRICE BREAKDOWN (MOCK)
                    </h5>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-cream/80">
                          ${selectedRoom.pricePerNight} × {nights} Night(s)
                        </span>
                        <span className="font-mono">${roomSubtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cream/80">Heritage Tax & Service (12%)</span>
                        <span className="font-mono">${taxesAndFees}</span>
                      </div>
                      <div className="w-full h-px bg-white/10 my-2" />
                      <div className="flex justify-between text-sm font-serif text-gold font-bold">
                        <span>ESTIMATED TOTAL</span>
                        <span className="font-mono text-lg text-white">${grandTotal}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded bg-white/5 border border-gold/20 text-[11px] text-cream/70 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                      <span>Frontend Demonstration Prototype. No payment required.</span>
                    </div>
                  </div>

                  <div className="pt-6 flex gap-3">
                    <button
                      onClick={() => setBookingStep("details")}
                      className="w-1/3 text-xs font-serif uppercase tracking-wider text-cream/70 hover:text-white py-3"
                    >
                      Back
                    </button>
                    <button
                      onClick={confirmBooking}
                      className="w-2/3 bg-sandstone hover:bg-sandstone-dark text-cream font-serif text-xs tracking-widest uppercase py-3 rounded border border-gold/40 shadow-lg flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4 text-gold" />
                      <span>CONFIRM BOOKING</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: BOOKING CONFIRMED */}
          {bookingStep === "confirmation" && completedBooking && (
            <div className="space-y-6 text-center print:text-left print:p-0">
              {/* Confirmed Icon */}
              <div className="w-16 h-16 rounded-full bg-sandstone/20 text-sandstone border border-sandstone flex items-center justify-center mx-auto print:hidden">
                <CheckCircle2 className="w-10 h-10 text-sandstone" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-[0.35em] text-sandstone font-bold block mb-1">
                  RESERVATION CONFIRMED
                </span>
                <h3 className="text-3xl font-serif text-charcoal">Hotel Rajmahal Palace</h3>
                <p className="text-xs text-charcoal/70 italic font-serif">
                  Where heritage meets the serenity of the hills
                </p>
              </div>

              {/* Booking Voucher Card */}
              <div className="bg-white p-6 rounded-lg border-2 border-gold/40 shadow-lg max-w-xl mx-auto text-left space-y-4 print:border-black print:shadow-none">
                <div className="flex justify-between items-center border-b border-sandstone/15 pb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-charcoal/60 block">
                      BOOKING ID
                    </span>
                    <span className="text-xl font-mono font-bold text-sandstone">
                      {completedBooking.bookingId}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded font-semibold uppercase">
                      CONFIRMED
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                  <div>
                    <span className="text-charcoal/60 block">Guest Name</span>
                    <span className="font-semibold text-charcoal text-sm">
                      {completedBooking.guestInfo.firstName} {completedBooking.guestInfo.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-charcoal/60 block">Email</span>
                    <span className="font-semibold text-charcoal">{completedBooking.guestInfo.email}</span>
                  </div>
                  <div>
                    <span className="text-charcoal/60 block">Check-In</span>
                    <span className="font-semibold text-charcoal">{completedBooking.checkIn}</span>
                  </div>
                  <div>
                    <span className="text-charcoal/60 block">Check-Out</span>
                    <span className="font-semibold text-charcoal">{completedBooking.checkOut}</span>
                  </div>
                  <div>
                    <span className="text-charcoal/60 block">Room Type</span>
                    <span className="font-semibold text-charcoal">{completedBooking.room.name}</span>
                  </div>
                  <div>
                    <span className="text-charcoal/60 block">Total Paid (Mock)</span>
                    <span className="font-semibold text-sandstone text-sm font-mono">
                      ${completedBooking.grandTotal}
                    </span>
                  </div>
                </div>

                {completedBooking.guestInfo.specialRequests && (
                  <div className="pt-2 border-t border-sandstone/10 text-xs">
                    <span className="text-charcoal/60 block">Special Requests:</span>
                    <p className="italic text-charcoal/80">{completedBooking.guestInfo.specialRequests}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 print:hidden">
                <button
                  onClick={handlePrintConfirmation}
                  className="w-full sm:w-auto bg-charcoal hover:bg-black text-cream font-serif text-xs tracking-widest uppercase px-6 py-3 rounded border border-gold/30 flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4 text-gold" />
                  <span>DOWNLOAD CONFIRMATION</span>
                </button>

                <button
                  onClick={resetBooking}
                  className="w-full sm:w-auto bg-sandstone hover:bg-sandstone-dark text-cream font-serif text-xs tracking-widest uppercase px-6 py-3 rounded border border-gold/40 flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  <span>BACK TO HOME</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
