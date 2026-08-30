"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ROOMS_DATA } from "@/data/rooms";
import { fetchAvailableRooms, createBookingRecord } from "@/lib/bookingService";

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

  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);

  const [checkIn, setCheckIn] = useState(formatDate(today));
  const [checkOut, setCheckOut] = useState(formatDate(tomorrow));
  const [guests, setGuests] = useState(2);
  const [roomsCount, setRoomsCount] = useState(1);

  const [availableRooms, setAvailableRooms] = useState(ROOMS_DATA);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);

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

  // Fetch available rooms from Supabase DB whenever dates or guests change
  const refreshAvailableRooms = useCallback(async () => {
    setIsLoadingRooms(true);
    try {
      const rooms = await fetchAvailableRooms(checkIn, checkOut, guests);
      if (rooms && rooms.length > 0) {
        setAvailableRooms(rooms);
        // Match selected room by id, slug, or room_number
        const stillAvailable = rooms.find(
          (r) =>
            r.id === selectedRoom?.id ||
            r.slug === selectedRoom?.slug ||
            r.slug === selectedRoom?.id ||
            r.id === selectedRoom?.slug ||
            (selectedRoom?.roomNumber && r.room_number === selectedRoom.roomNumber) ||
            (selectedRoom?.room_number && r.room_number === selectedRoom.room_number)
        );
        if (stillAvailable) {
          setSelectedRoom(stillAvailable);
        } else {
          setSelectedRoom(rooms[0]);
        }
      }
    } catch (err) {
      console.error("Failed to query DB room availability:", err);
    } finally {
      setIsLoadingRooms(false);
    }
  }, [checkIn, checkOut, guests, selectedRoom]);

  useEffect(() => {
    refreshAvailableRooms();
  }, [checkIn, checkOut, guests]);

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

  const pricePerNight = selectedRoom
    ? Number(
      selectedRoom.price_per_night !== undefined
        ? selectedRoom.price_per_night
        : (selectedRoom.pricePerNight !== undefined ? selectedRoom.pricePerNight : 1)
    )
    : 1;
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
  };

  const confirmBooking = async (paymentData = {}) => {
    const payload = {
      guestInfo,
      room: selectedRoom,
      checkIn,
      checkOut,
      nights,
      guests,
      roomsCount,
      pricePerNight,
      roomSubtotal,
      taxesAndFees,
      grandTotal,
      paymentStatus: paymentData.paymentStatus || "paid",
      bookingStatus: paymentData.bookingStatus || "confirmed",
      razorpayOrderId: paymentData.razorpayOrderId || null,
      razorpayPaymentId: paymentData.razorpayPaymentId || null,
    };

    const res = await createBookingRecord(payload);
    if (res.success && res.booking) {
      setCompletedBooking({
        bookingId: res.booking.booking_reference,
        room: selectedRoom,
        checkIn,
        checkOut,
        nights,
        guests,
        guestInfo,
        grandTotal,
        paymentStatus: res.booking.payment_status,
        bookingStatus: res.booking.booking_status,
        createdAt: res.booking.created_at,
      });
      setBookingStep("confirmation");
    }
  };

  const resetBooking = () => {
    setCompletedBooking(null);
    setIsBookingDrawerOpen(false);
    setBookingStep("available");
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
        availableRooms,
        isLoadingRooms,
        refreshAvailableRooms,
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

