"use client";

import { useBooking } from "@/context/BookingContext";
import DiningModal from "@/components/DiningModal";

export default function GlobalDiningModal() {
  const { isDiningOpen, closeDining } = useBooking();

  return (
    <DiningModal
      isOpen={isDiningOpen}
      onClose={closeDining}
    />
  );
}
