"use client";

import React, { createContext, useContext, useState } from "react";
import { ROOMS_DATA } from "@/data/rooms";

const BookingContext = createContext();

export function BookingProvider({ children }) {
  // Helper to format date strings YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const defaultCheckout = new Date(today);
  defaultCheckout.setDate(today.getDate() + 4);

  const [checkIn, setCheckIn] = useState(formatDate(tomorrow));
  const [checkOut, setCheckOut] = useState(formatDate(defaultCheckout));
  const [guests, setGuests] = useState(2);
  const [roomsCount, setRoomsCount] = useState(1);

  const [selectedRoom, setSelectedRoom] = useState(ROOMS_DATA[0]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState("available");

  // Modern Luxury Modals State
  const [isSuiteOpen, setIsSuiteOpen] = useState(false);
  const [isDiningOpen, setIsDiningOpen] = useState(false);
  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);

  const [guestInfo, setGuestInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  const [completedBooking, setCompletedBooking] = useState(null);

  // Calculate total nights
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights();

  const pricePerNight = selectedRoom ? selectedRoom.pricePerNight : 240;
  const roomSubtotal = pricePerNight * nights * roomsCount;
  const taxesAndFees = Math.round(roomSubtotal * 0.18);
  const grandTotal = roomSubtotal + taxesAndFees;

  const openBookingModal = (step = "available") => {
    setBookingStep(step);
    setIsBookingDrawerOpen(true);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setIsBookingDrawerOpen(false);
  };

  const openSuites = () => setIsSuiteOpen(true);
  const closeSuites = () => setIsSuiteOpen(false);

  const openDining = () => setIsDiningOpen(true);
  const closeDining = () => setIsDiningOpen(false);

  const openBookingDrawer = (room = null) => {
    if (room) setSelectedRoom(room);
    setIsBookingDrawerOpen(true);
  };
  const closeBookingDrawer = () => setIsBookingDrawerOpen(false);

  const startBookingForRoom = (room) => {
    if (room) setSelectedRoom(room);
    setIsBookingDrawerOpen(true);
  };

  const searchAvailableRooms = (newCheckIn, newCheckOut, newGuests, newRooms) => {
    if (newCheckIn) setCheckIn(newCheckIn);
    if (newCheckOut) setCheckOut(newCheckOut);
    if (newGuests) setGuests(newGuests);
    if (newRooms) setRoomsCount(newRooms);
    setIsBookingDrawerOpen(true);
  };

  const confirmBooking = () => {
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const bookingId = `RMP-${randomCode}`;

    const newBooking = {
      bookingId,
      room: selectedRoom,
      checkIn,
      checkOut,
      nights,
      guests,
      roomsCount,
      guestInfo,
      pricePerNight,
      roomSubtotal,
      taxesAndFees,
      grandTotal,
      createdAt: new Date().toISOString(),
    };

    setCompletedBooking(newBooking);
  };

  const resetBooking = () => {
    setCompletedBooking(null);
    setIsBookingDrawerOpen(false);
  };

  return (
    <BookingContext.Provider
      value={{
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
        isBookingModalOpen,
        openBookingModal,
        closeBookingModal,
        bookingStep,
        setBookingStep,
        startBookingForRoom,
        searchAvailableRooms,
        guestInfo,
        setGuestInfo,
        completedBooking,
        confirmBooking,
        resetBooking,
        nights,
        roomSubtotal,
        taxesAndFees,
        grandTotal,
        // Modals state & handlers
        isSuiteOpen,
        openSuites,
        closeSuites,
        isDiningOpen,
        openDining,
        closeDining,
        isBookingDrawerOpen,
        openBookingDrawer,
        closeBookingDrawer,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
