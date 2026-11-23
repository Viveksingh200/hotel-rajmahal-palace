"use client";

import { useEffect } from "react";
import { useBooking } from "@/context/BookingContext";
import { useAuth } from "@/context/AuthContext";
import { ROOMS_DATA } from "@/data/rooms";
import BookingDrawer from "@/components/BookingDrawer";

export default function GlobalBookingDrawer() {
  const { isBookingDrawerOpen, openBookingDrawer, closeBookingDrawer, selectedRoom } = useBooking();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && typeof window !== "undefined") {
      const shouldAutoOpen = sessionStorage.getItem("rajmahal_auto_open_booking");
      if (shouldAutoOpen) {
        sessionStorage.removeItem("rajmahal_auto_open_booking");
        const savedRoomId = sessionStorage.getItem("rajmahal_auth_saved_room_id");
        let targetRoom = null;
        if (savedRoomId) {
          sessionStorage.removeItem("rajmahal_auth_saved_room_id");
          targetRoom = ROOMS_DATA.find((r) => r.id === savedRoomId || r.slug === savedRoomId);
        }
        const timer = setTimeout(() => {
          openBookingDrawer(targetRoom || null);
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, openBookingDrawer]);

  return (
    <BookingDrawer
      isOpen={isBookingDrawerOpen}
      onClose={closeBookingDrawer}
      initialSuite={selectedRoom}
    />
  );
}
