"use client";

import { useState, useEffect } from "react";
import { X, Calendar, Users, Crown, CheckCircle, Tag, ArrowRight, Sparkles, Loader2, ShieldCheck, Clock, Info } from "lucide-react";
import confetti from "canvas-confetti";
import { ROOMS_DATA } from "@/data/rooms";
import { fetchAvailableRooms, fetchRooms } from "@/lib/bookingService";
import { useBooking } from "@/context/BookingContext";
import { useAuth } from "@/context/AuthContext";
import CustomCalendarPicker from "@/components/CustomCalendarPicker";
import {
  getDefaultBookingTime as getSensibleDefaultTime,
  getCheckOutTime,
  isSlotPassed,
  getSensibleDefaultCheckInDate,
  getLocalDateString,
  getNowInIST,
} from "@/lib/timeUtils";

export default function BookingDrawer({ isOpen, onClose, initialSuite = null }) {
  const {
    checkIn: ctxCheckIn,
    checkOut: ctxCheckOut,
    bookingTime: ctxBookingTime,
    guests: ctxGuests,
    roomsCount: ctxRoomsCount,
    setRoomsCount: ctxSetRoomsCount,
    availableRooms,
  } = useBooking();
  const { user, isAuthenticated, openLoginModal } = useAuth();
  const getToday = () => getSensibleDefaultCheckInDate();
  const getTomorrow = () => {
    const d = getNowInIST();
    d.setDate(d.getDate() + 1);
    return getLocalDateString(d);
  };

  const getMinCheckOut = (checkInDate) => {
    if (!checkInDate) return getTomorrow();
    const d = new Date(checkInDate);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const [rooms, setRooms] = useState(() => (availableRooms && availableRooms.length > 0 ? availableRooms : ROOMS_DATA));
  const [userSelectedRoomId, setUserSelectedRoomId] = useState(null);
  const effectiveSelectedRoomId = userSelectedRoomId || initialSuite?.id || initialSuite?.slug || ROOMS_DATA[0].id;

  const [roomsQuantity, setRoomsQuantity] = useState(ctxRoomsCount || 1);
  const [checkIn, setCheckIn] = useState(ctxCheckIn || getToday());
  const [checkOut, setCheckOut] = useState(ctxCheckOut || getTomorrow());
  const [bookingTime, setBookingTime] = useState(() => {
    const effectiveCheckIn = ctxCheckIn || getToday();
    if (ctxBookingTime && !isSlotPassed(ctxBookingTime, effectiveCheckIn)) {
      return ctxBookingTime;
    }
    return getSensibleDefaultTime(effectiveCheckIn);
  });
  const [step, setStep] = useState(1); // 1 = Select Room & Dates, 2 = Guest Information
  const [adults, setAdults] = useState(ctxGuests || 2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [guestName, setGuestName] = useState(() => user?.user_metadata?.full_name || user?.user_metadata?.name || "");
  const [guestEmail, setGuestEmail] = useState(() => user?.email || "");
  const [guestPhone, setGuestPhone] = useState("");
  const [confirmedBookingRef, setConfirmedBookingRef] = useState("");

  const handleCheckInChange = (newDate) => {
    setCheckIn(newDate);
    if (isSlotPassed(bookingTime, newDate)) {
      setBookingTime(getSensibleDefaultTime(newDate));
    }
    if (!checkOut || checkOut <= newDate) {
      setCheckOut(getMinCheckOut(newDate));
    }
  };

  const effectiveRooms = availableRooms && availableRooms.length > 0 ? availableRooms : rooms;

  const allSelectableRooms = ROOMS_DATA.map((baseRoom) => {
    const liveMatch = effectiveRooms.find(
      (r) =>
        r.id === baseRoom.id ||
        r.slug === baseRoom.slug ||
        r.room_name === baseRoom.name ||
        r.name === baseRoom.name
    );
    if (!liveMatch) return baseRoom;
    const livePrice = Number(
      liveMatch.price_per_night !== undefined
        ? liveMatch.price_per_night
        : (liveMatch.pricePerNight !== undefined ? liveMatch.pricePerNight : baseRoom.pricePerNight)
    );
    return {
      ...baseRoom,
      ...liveMatch,
      price_per_night: livePrice,
      pricePerNight: livePrice,
    };
  });

  const room =
    allSelectableRooms.find(
      (r) =>
        r.id === effectiveSelectedRoomId ||
        r.slug === effectiveSelectedRoomId ||
        r.room_number === effectiveSelectedRoomId
    ) || allSelectableRooms[0];

  // Room capacity logic: Scaled by number of rooms (e.g. 3 Adults & 2 Children per room)
  const maxAllowedAdults = Number(room.max_adults || room.maxAdults || 3) * roomsQuantity;
  const maxAllowedChildren = Number(room.max_children || room.maxChildren || 2) * roomsQuantity;

  const handleNextToGuestInfo = () => {
    if (!isAuthenticated) {
      openLoginModal({ autoOpenBooking: true, room });
      return;
    }
    setErrorMessage("");
    const todayStr = getToday();
    if (checkIn < todayStr) {
      setErrorMessage("Check-in date cannot be in the past.");
      return;
    }
    if (checkOut <= checkIn) {
      setErrorMessage("Check-out date must be after check-in date.");
      return;
    }
    if (adults > maxAllowedAdults) {
      setErrorMessage(`Maximum ${maxAllowedAdults} adults allowed for ${roomsQuantity} room(s).`);
      return;
    }
    if (childrenCount > maxAllowedChildren) {
      setErrorMessage(`Maximum ${maxAllowedChildren} children allowed for ${roomsQuantity} room(s).`);
      return;
    }
    setStep(2);
  };

  // 1. Sync with context when opened
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStep(1);
      const effectiveCheckIn = ctxCheckIn || getToday();
      if (ctxCheckIn) setCheckIn(ctxCheckIn);
      if (ctxCheckOut) setCheckOut(ctxCheckOut);
      if (ctxRoomsCount) setRoomsQuantity(ctxRoomsCount);
      if (ctxBookingTime && !isSlotPassed(ctxBookingTime, effectiveCheckIn)) {
        setBookingTime(ctxBookingTime);
      } else {
        setBookingTime(getSensibleDefaultTime(effectiveCheckIn));
      }
      if (ctxGuests) {
        setAdults((prev) => Math.min(ctxGuests, maxAllowedAdults));
      }
      if (user?.email) {
        setGuestEmail((prev) => prev || user.email);
      }
      const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || "";
      if (fullName) {
        setGuestName((prev) => prev || fullName);
      }
    }
  }, [isOpen, ctxBookingTime, ctxCheckIn, ctxCheckOut, ctxRoomsCount, ctxGuests, maxAllowedAdults, user]);

  // Fetch live prices directly from Supabase whenever drawer opens
  useEffect(() => {
    if (isOpen) {
      let isMounted = true;
      fetchRooms()
        .then((live) => {
          if (isMounted && live && live.length > 0) {
            setRooms(live);
          }
        })
        .catch(() => {});
      return () => {
        isMounted = false;
      };
    }
  }, [isOpen]);

  // 2. Load Razorpay script dynamically
  useEffect(() => {
    if (isOpen && typeof window !== "undefined" && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [isOpen]);

  // 4. Auto-clamp guests when room capacity changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAdults((prev) => (prev > maxAllowedAdults ? maxAllowedAdults : prev));
    setChildrenCount((prev) => (prev > maxAllowedChildren ? maxAllowedChildren : prev));
  }, [maxAllowedAdults, maxAllowedChildren]);

  // 5. Fetch live available rooms (status only)
  useEffect(() => {
    let isMounted = true;
    async function loadAvailability() {
      try {
        const avail = await fetchAvailableRooms(checkIn, checkOut, adults + childrenCount);
        if (isMounted && avail && avail.length > 0) {
          setRooms(avail);
        }
      } catch (err) {
        console.error("Availability load error:", err);
      }
    }
    if (isOpen) {
      loadAvailability();
    }
    return () => {
      isMounted = false;
    };
  }, [checkIn, checkOut, adults, childrenCount, isOpen]);

  if (!isOpen) return null;

  // Calculate nights & prices scaled by roomsQuantity
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.max(1, end.getTime() - start.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const pricePerNight = Number(
    room.price_per_night !== undefined
      ? room.price_per_night
      : (room.pricePerNight !== undefined ? room.pricePerNight : 1)
  );
  const roomRate = pricePerNight * nights * roomsQuantity;
  const taxes = 0; // GST removed per request
  const totalAmount = roomRate;

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openLoginModal({ autoOpenBooking: true, room });
      return;
    }
    setErrorMessage("");

    const todayStr = getToday();
    if (checkIn < todayStr) {
      setErrorMessage("Check-in date cannot be in the past. Please select today or a future date.");
      return;
    }

    if (checkOut <= checkIn) {
      setErrorMessage("Check-out date must be after check-in date.");
      return;
    }

    if (adults > maxAllowedAdults) {
      setErrorMessage(`Maximum ${maxAllowedAdults} adults allowed.`);
      return;
    }

    if (childrenCount > maxAllowedChildren) {
      setErrorMessage(`Maximum ${maxAllowedChildren} children allowed.`);
      return;
    }

    setIsProcessing(true);

    try {
      const nameParts = (guestName.trim() || "Estemeed Guest").split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || "Guest";

      // 1. Create Razorpay order via Server API
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: room.id,
          checkIn,
          checkOut,
          bookingTime,
          guests: adults + childrenCount,
          roomsCount: roomsQuantity,
          guestInfo: {
            firstName,
            lastName,
            email: guestEmail,
            phone: guestPhone || "",
            bookingTime,
          },
        }),
      });

      const orderData = await res.json();
      if (!res.ok || orderData.error) {
        throw new Error(orderData.error || "Failed to create payment order");
      }

      setConfirmedBookingRef(orderData.bookingReference);

      // 2. Open Razorpay Checkout Modal if SDK exists
      if (typeof window !== "undefined" && window.Razorpay) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amountInPaise,
          currency: "INR",
          name: "Hotel Rajmahal Palace",
          description: `Reservation for ${orderData.roomName} (${roomsQuantity} Rooms × ${nights} Nights)`,
          image: "/favicon.ico",
          order_id: orderData.orderId,
          handler: async function (response) {
            // 3. Verify Razorpay Payment Signature on Server
            try {
              const verifyRes = await fetch("/api/razorpay/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  bookingId: orderData.bookingId,
                  bookingReference: orderData.bookingReference,
                  customerName: guestName,
                  customerEmail: guestEmail,
                  customerPhone: guestPhone,
                  roomName: room.room_name || room.name,
                  roomsCount: roomsQuantity,
                  checkIn,
                  checkOut,
                  bookingTime,
                  nights,
                  totalAmount,
                }),
              });

              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                try {
                  const existing = JSON.parse(localStorage.getItem("rajmahal_recent_refs") || "[]");
                  if (!existing.includes(orderData.bookingReference)) {
                    existing.push(orderData.bookingReference);
                    localStorage.setItem("rajmahal_recent_refs", JSON.stringify(existing));
                  }
                } catch (e) {
                  console.error(e);
                }
                setIsSubmitted(true);
                setIsProcessing(false);
                triggerConfetti();
              } else {
                setErrorMessage(verifyData.error || "Payment verification failed.");
                setIsProcessing(false);
              }
            } catch (vErr) {
              setErrorMessage("Error verifying payment signature.");
              setIsProcessing(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
          prefill: {
            name: guestName,
            email: guestEmail,
            contact: guestPhone || "",
          },
          theme: {
            color: "#933d2d",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", async function (response) {
          setErrorMessage(response.error?.description || "Payment was rejected or cancelled.");
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        setIsSubmitted(true);
        setIsProcessing(false);
        triggerConfetti();
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Failed to initiate reservation payment. Please try again.");
      setIsProcessing(false);
    }
  };


  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#C9A86A", "#D4AF37", "#933D2D", "#F7F5F2"],
      });
    } catch (e) {
      // Confetti fallback
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end bg-black/70 backdrop-blur-sm animate-fadeIn"
      style={{ cursor: "default" }}
    >
      {/* 1. Backdrop Overlay (Closes drawer on outside click) */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
        aria-label="Close background overlay"
      />

      {/* 2. Form Drawer Content (Sibling element) */}
      <div
        className="relative z-10 w-full max-w-lg h-full bg-[#100F0E] border-l border-[#D4AF37]/30 shadow-2xl flex flex-col justify-between overflow-y-auto cursor-default touch-pan-y"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#D4AF37]/20 flex items-center justify-between bg-[#161412]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] text-[#D4AF37] uppercase font-semibold">
                RESERVE YOUR STAY
              </span>
              <h2 className="font-serif text-xl text-[#F7F5F2] font-semibold">
                Hotel Rajmahal Palace
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            data-cursor="CLOSE"
            aria-label="Close"
            className="p-2 rounded-full border border-[#D4AF37]/30 text-[#D6B892] hover:bg-[#D4AF37] hover:text-[#100F0E] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isSubmitted ? (
          <div className="p-8 text-center flex flex-col items-center justify-center flex-1 space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.4)]">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold block mb-1">
                RESERVATION CONFIRMED
              </span>
              <h3 className="font-serif text-3xl text-[#F7F5F2] font-semibold">
                Welcome to Rajmahal Palace!
              </h3>
              <p className="text-xs text-[#D6B892]/80 font-sans mt-3 max-w-sm leading-relaxed">
                Thank you, <strong className="text-[#F7F5F2]">{guestName || "Estemeed Guest"}</strong>. Your reservation for <strong className="text-[#D4AF37]">{room.room_name || room.name}</strong> ({roomsQuantity} Rooms • {nights} Nights) has been confirmed.
              </p>
            </div>

            <div className="w-full bg-[#161412] border border-[#D4AF37]/25 rounded-md p-4 text-xs text-left space-y-2 text-[#D6B892]">
              <div className="flex justify-between border-b border-[#D4AF37]/15 pb-1.5">
                <span>Booking Reference</span>
                <span className="font-mono font-bold text-[#D4AF37]">{confirmedBookingRef || "RMP-829104"}</span>
              </div>
              <div className="flex justify-between border-b border-[#D4AF37]/15 pb-1.5">
                <span>Rooms Reserved</span>
                <span className="font-semibold text-[#F7F5F2]">{roomsQuantity} {roomsQuantity > 1 ? "Rooms" : "Room"}</span>
              </div>
              <div className="flex justify-between border-b border-[#D4AF37]/15 pb-1.5">
                <span>Check-In & Arrival Time</span>
                <span className="font-semibold text-[#F7F5F2]">{checkIn} • {bookingTime}</span>
              </div>
              <div className="flex justify-between border-b border-[#D4AF37]/15 pb-1.5">
                <span>Check-Out</span>
                <span className="font-semibold text-[#F7F5F2]">{checkOut} ({getCheckOutTime(bookingTime)})</span>
              </div>
              <div className="flex justify-between border-b border-[#D4AF37]/15 pb-1.5">
                <span>Stay Duration</span>
                <span className="font-semibold text-[#D4AF37]">{nights} Night(s)</span>
              </div>
              <div className="flex justify-between border-b border-[#D4AF37]/15 pb-1.5 text-[#E6C875]">
                <span>Cancellation Policy</span>
                <span className="font-semibold font-mono">Non-Refundable</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Total Paid (Verified)</span>
                <span className="font-serif text-[#D4AF37] font-semibold text-base">₹{totalAmount?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-2.5 w-full">
              <a
                href={`/booking?ref=${confirmedBookingRef || "RMP-829104"}`}
                onClick={onClose}
                className="w-full py-3.5 bg-[#D4AF37] text-[#100F0E] text-xs font-serif uppercase tracking-[0.2em] font-semibold rounded-sm hover:bg-[#C9A86A] transition-colors cursor-pointer flex items-center justify-center gap-2 block text-center"
              >
                <span>VIEW DIGITAL PASS</span>
              </a>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-transparent border border-[#D4AF37]/30 text-[#D6B892] text-xs font-serif uppercase tracking-wider rounded-sm hover:bg-[#D4AF37]/10 transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
            {/* Error Message Box */}
            {errorMessage && (
              <div className="p-3 bg-red-950/60 border border-red-500/50 rounded text-red-200 text-xs flex items-center justify-between">
                <span>{errorMessage}</span>
                <button
                  type="button"
                  onClick={() => setErrorMessage("")}
                  className="text-red-400 hover:text-white text-base font-bold ml-2 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Step Indicator Header (2 Parts) */}
            <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3 text-[11px] sm:text-xs font-mono">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`flex-1 py-1.5 sm:py-2 px-1.5 sm:px-2.5 rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                  step === 1
                    ? "bg-gradient-to-r from-[#C9A86A] via-[#D4AF37] to-[#C9A86A] text-[#100F0E] font-bold shadow-md"
                    : "text-[#D6B892]/70 hover:text-[#F7F5F2] hover:bg-[#1A1816]"
                }`}
              >
                <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-current flex items-center justify-center text-[9px] sm:text-[10px] font-bold shrink-0">1</span>
                <span className="truncate">ROOM & DATES</span>
              </button>

              <div className="w-3 sm:w-4 h-px bg-[#D4AF37]/30 mx-1 shrink-0" />

              <button
                type="button"
                onClick={() => {
                  if (step === 1) handleNextToGuestInfo();
                }}
                className={`flex-1 py-1.5 sm:py-2 px-1.5 sm:px-2.5 rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                  step === 2
                    ? "bg-gradient-to-r from-[#C9A86A] via-[#D4AF37] to-[#C9A86A] text-[#100F0E] font-bold shadow-md"
                    : "text-[#D6B892]/70 hover:text-[#F7F5F2] hover:bg-[#1A1816]"
                }`}
              >
                <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-current flex items-center justify-center text-[9px] sm:text-[10px] font-bold shrink-0">2</span>
                <span className="truncate">GUEST DETAILS</span>
              </button>
            </div>

            {/* ================= PART 1: SELECT ROOM and DATES & ARRIVAL TIME ================= */}
            {step === 1 && (
              <div className="space-y-5 animate-fadeIn flex-1">
                {/* 1. SELECT ROOM & NUMBER OF ROOMS */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs sm:text-sm font-mono uppercase tracking-widest text-[#D4AF37] font-semibold block mb-1.5">
                        1. SELECT ROOM
                      </label>
                      <select
                        value={room.id}
                        onChange={(e) => setUserSelectedRoomId(e.target.value)}
                        className="w-full bg-[#161412] border border-[#D4AF37]/40 rounded-md px-3.5 py-2 text-sm text-[#F7F5F2] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] cursor-pointer"
                      >
                        {allSelectableRooms.map((r) => {
                          const roomP = Number(r.price_per_night !== undefined ? r.price_per_night : r.pricePerNight);
                          return (
                            <option key={r.id} value={r.id} className="bg-[#100F0E] text-[#F7F5F2]">
                              {r.room_name || r.name} — ₹{roomP.toLocaleString('en-IN')}/night
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs sm:text-sm font-mono uppercase tracking-widest text-[#D4AF37] font-semibold block mb-1.5 flex items-center justify-between">
                        <span>NUMBER OF ROOMS</span>
                        <span className="text-[10px] text-[#D6B892]/70 font-mono">Max 8</span>
                      </label>
                      <select
                        value={roomsQuantity}
                        onChange={(e) => {
                          const count = Number(e.target.value);
                          setRoomsQuantity(count);
                        }}
                        className="w-full bg-[#161412] border border-[#D4AF37]/40 rounded-md px-3.5 py-2 text-sm text-[#F7F5F2] font-mono focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] cursor-pointer"
                      >
                        {Array.from({ length: 8 }, (_, i) => i + 1).map((num) => (
                          <option key={num} value={num} className="bg-[#100F0E] text-[#F7F5F2]">
                            {num} {num === 1 ? "Room" : "Rooms"} (₹{(pricePerNight * num).toLocaleString('en-IN')}/night)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Guests Capacity Selector */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-mono uppercase tracking-widest text-[#D6B892] font-medium block mb-1 flex items-center justify-between">
                        <span>ADULTS</span>
                        <span className="text-[10px] text-[#D4AF37]/80 font-mono">Max {maxAllowedAdults}</span>
                      </label>
                      <select
                        value={Math.min(adults, maxAllowedAdults)}
                        onChange={(e) => setAdults(Number(e.target.value))}
                        className="w-full bg-[#161412] border border-[#D4AF37]/30 rounded-md px-3 py-2 text-sm text-[#F7F5F2] font-mono cursor-pointer"
                      >
                        {Array.from({ length: maxAllowedAdults }, (_, i) => i + 1).map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? "Adult" : "Adults"}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-mono uppercase tracking-widest text-[#D6B892] font-medium block mb-1 flex items-center justify-between">
                        <span>CHILDREN</span>
                        <span className="text-[10px] text-[#D4AF37]/80 font-mono">Max {maxAllowedChildren}</span>
                      </label>
                      <select
                        value={Math.min(childrenCount, maxAllowedChildren)}
                        onChange={(e) => setChildrenCount(Number(e.target.value))}
                        className="w-full bg-[#161412] border border-[#D4AF37]/30 rounded-md px-3 py-2 text-sm text-[#F7F5F2] font-mono cursor-pointer"
                      >
                        {Array.from({ length: maxAllowedChildren + 1 }, (_, i) => i).map((num) => (
                          <option key={num} value={num}>
                            {num === 0 ? "0 Children" : `${num} ${num === 1 ? "Child" : "Children"}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="text-[10.5px] text-[#D6B892]/70 font-mono flex items-center justify-between pt-0.5">
                    <span>Capacity for {roomsQuantity} Room{roomsQuantity > 1 ? "s" : ""}:</span>
                    <span className="text-[#D4AF37]">Max {maxAllowedAdults} Adults + {maxAllowedChildren} Kids</span>
                  </div>
                </div>

                {/* 2. DATES & ARRIVAL TIME (Custom Calendar with horizontal time scroll) */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs sm:text-sm font-mono uppercase tracking-widest text-[#D4AF37] font-semibold block">
                      2. DATES & ARRIVAL TIME
                    </label>
                    <span className="text-[10.5px] font-mono text-[#D6B892]/80">
                      {roomsQuantity} Room{roomsQuantity > 1 ? "s" : ""} • {nights} Night{nights > 1 ? "s" : ""}
                    </span>
                  </div>

                  <CustomCalendarPicker
                    checkIn={checkIn}
                    onCheckInChange={handleCheckInChange}
                    checkOut={checkOut}
                    onCheckOutChange={setCheckOut}
                    bookingTime={bookingTime}
                    onBookingTimeChange={setBookingTime}
                    minDate={getToday()}
                  />

                  {/* Policy Banner: 22-Hour Stay & Non-Refundable */}
                  <div className="bg-[#181614] border border-[#D4AF37]/25 rounded px-2.5 sm:px-3 py-2 flex flex-wrap items-center justify-between gap-1.5 text-[10.5px] sm:text-[11px] font-mono text-[#D6B892]">
                    <span className="text-[#D4AF37] font-semibold whitespace-nowrap">22-Hour Stay Policy</span>
                    <span className="text-[#E6C875] font-medium bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/30 whitespace-nowrap">
                      Non-Refundable Booking
                    </span>
                  </div>
                </div>

                {/* Part 1 CTA: Continue to Guest Details */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleNextToGuestInfo}
                    className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-[#C9A86A] via-[#D4AF37] to-[#C9A86A] text-[#100F0E] text-[11px] sm:text-sm font-serif uppercase tracking-[0.14em] sm:tracking-[0.2em] font-bold rounded-md shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:shadow-[0_0_35px_rgba(212,175,55,0.6)] hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer px-3 sm:px-4"
                  >
                    <span>CONTINUE TO GUEST INFO</span>
                    <ArrowRight className="w-4 h-4 text-[#100F0E] shrink-0" />
                  </button>
                </div>
              </div>
            )}

            {/* ================= PART 2: GUEST INFORMATION ================= */}
            {step === 2 && (
              <form onSubmit={handleSubmitBooking} className="space-y-4 animate-fadeIn flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Selected Booking Summary Preview Box */}
                  <div className="bg-[#161412] border border-[#D4AF37]/30 rounded-xl p-3.5 space-y-2 text-xs text-[#D6B892]">
                    <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-2">
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block">SELECTED ROOM</span>
                        <strong className="text-sm font-serif text-[#F7F5F2] truncate block">
                          {room.room_name || room.name} ({roomsQuantity} {roomsQuantity > 1 ? "Rooms" : "Room"})
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-[11px] font-mono text-[#D4AF37] underline hover:text-[#F7F5F2] cursor-pointer shrink-0"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                      <div>
                        <span className="text-[#D6B892]/60 block text-[9.5px]">CHECK-IN</span>
                        <span className="font-semibold text-[#F7F5F2]">{checkIn} • {bookingTime}</span>
                      </div>
                      <div>
                        <span className="text-[#D6B892]/60 block text-[9.5px]">CHECK-OUT</span>
                        <span className="font-semibold text-[#F7F5F2]">{checkOut} ({getCheckOutTime(bookingTime)})</span>
                      </div>
                    </div>
                  </div>

                  {/* Guest Contact Inputs */}
                  <div className="space-y-2.5">
                    <label className="text-xs sm:text-sm font-mono uppercase tracking-widest text-[#D4AF37] font-semibold block">
                      GUEST INFORMATION
                    </label>
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full bg-[#161412] border border-[#D4AF37]/30 rounded-md px-3.5 py-2 text-sm sm:text-base text-[#F7F5F2] focus:outline-none focus:border-[#D4AF37]"
                      required
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="email"
                        placeholder="Email Address *"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="w-full bg-[#161412] border border-[#D4AF37]/30 rounded-md px-3.5 py-2 text-sm sm:text-base text-[#F7F5F2] focus:outline-none focus:border-[#D4AF37]"
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number *"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className="w-full bg-[#161412] border border-[#D4AF37]/30 rounded-md px-3.5 py-2 text-sm sm:text-base text-[#F7F5F2] focus:outline-none focus:border-[#D4AF37]"
                        required
                      />
                    </div>
                  </div>

                  {/* Total Cost Summary */}
                  <div className="bg-[#161412] border border-[#D4AF37]/30 rounded-md p-4 space-y-1.5 text-xs sm:text-sm text-[#D6B892]">
                    <div className="flex justify-between">
                      <span>Rate ({roomsQuantity} {roomsQuantity > 1 ? "Rooms" : "Room"} × {nights} {nights > 1 ? "Nights" : "Night"})</span>
                      <span className="font-mono font-semibold text-[#F7F5F2]">₹{roomRate?.toLocaleString('en-IN')}</span>
                    </div>
                  
                    <div className="border-t border-[#D4AF37]/20 pt-2 flex justify-between items-baseline font-serif text-base text-[#F7F5F2]">
                      <span className="font-semibold">Grand Total</span>
                      <span className="text-[#D4AF37] font-semibold text-2xl font-mono">₹{totalAmount?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="border-t border-[#D4AF37]/15 pt-2 mt-1 flex items-center gap-1.5 text-[11px] text-[#E6C875] font-serif">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span><strong>Cancellation Policy:</strong> Non-refundable reservation once confirmed.</span>
                    </div>
                  </div>
                </div>

                {/* Step 2 Actions */}
                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-[#C9A86A] via-[#D4AF37] to-[#C9A86A] text-[#100F0E] text-[11px] sm:text-sm font-serif uppercase tracking-[0.12em] sm:tracking-[0.22em] font-bold rounded-md shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-[1.01] transition-transform flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer disabled:opacity-50 px-2 sm:px-4"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                        <span className="truncate">INITIALIZING PAYMENT...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 shrink-0" />
                        <span className="truncate">PAY WITH RAZORPAY (₹{totalAmount?.toLocaleString('en-IN')})</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full py-2.5 bg-[#141210] hover:bg-[#1A1816] text-[#D6B892] hover:text-[#F7F5F2] text-xs font-mono uppercase tracking-wider rounded-md border border-[#D4AF37]/25 transition-colors cursor-pointer text-center"
                  >
                    ← Edit Room & Dates
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

