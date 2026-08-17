"use client";

import React, { useEffect } from "react";
import { useBooking } from "@/context/BookingContext";
import BookingWidget from "@/components/BookingWidget";
import RoomsSection from "@/components/RoomsSection";

export default function BookingPage() {
  const { openBookingModal } = useBooking();

  useEffect(() => {
    if (typeof openBookingModal === "function") {
      openBookingModal("available");
    }
  }, [openBookingModal]);

  return (
    <div className="w-full bg-cream text-charcoal pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.4em] text-sandstone font-semibold block mb-2">
            ONLINE RESERVATIONS
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif text-charcoal tracking-tight">
            Book Your Stay
          </h1>
          <div className="w-20 h-0.5 bg-gold mx-auto my-3" />
          <p className="text-base font-serif italic text-sandstone">
            Select dates and choose your preferred suite at Hotel Rajmahal Palace.
          </p>
        </div>

        <BookingWidget />
        <RoomsSection />
      </div>
    </div>
  );
}
