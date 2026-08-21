"use client";

import { useBooking } from "@/context/BookingContext";
import BookingDrawer from "@/components/BookingDrawer";

export default function GlobalBookingDrawer() {
  const { isBookingDrawerOpen, closeBookingDrawer, selectedRoom } = useBooking();

  return (
    <BookingDrawer
      isOpen={isBookingDrawerOpen}
      onClose={closeBookingDrawer}
      initialSuite={selectedRoom}
    />
  );
}
