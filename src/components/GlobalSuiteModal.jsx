"use client";

import { useBooking } from "@/context/BookingContext";
import SuiteModal from "@/components/SuiteModal";

export default function GlobalSuiteModal() {
  const { isSuiteOpen, closeSuites, startBookingForRoom } = useBooking();

  return (
    <SuiteModal
      isOpen={isSuiteOpen}
      onClose={closeSuites}
      onSelectSuite={(suite) => {
        closeSuites();
        startBookingForRoom(suite);
      }}
    />
  );
}
