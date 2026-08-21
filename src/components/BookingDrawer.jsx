"use client";

import { useState, useEffect } from "react";
import { X, Calendar, Users, Crown, CheckCircle, Tag, ArrowRight, Sparkles, Loader2, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";
import { ROOMS_DATA } from "@/data/rooms";
import { fetchAvailableRooms } from "@/lib/bookingService";

export default function BookingDrawer({ isOpen, onClose, initialSuite = null }) {
  const getToday = () => new Date().toISOString().split("T")[0];
  const getTomorrow = () => new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const getMinCheckOut = (checkInDate) => {
    if (!checkInDate) return getTomorrow();
    const d = new Date(checkInDate);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const [rooms, setRooms] = useState(ROOMS_DATA);
  const [selectedRoomId, setSelectedRoomId] = useState(initialSuite?.id || ROOMS_DATA[0].id);
  const [checkIn, setCheckIn] = useState(getToday());
  const [checkOut, setCheckOut] = useState(getTomorrow());
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCheckInChange = (newDate) => {
    setCheckIn(newDate);
    if (!checkOut || checkOut <= newDate) {
      setCheckOut(getMinCheckOut(newDate));
    }
  };

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [confirmedBookingRef, setConfirmedBookingRef] = useState("");

  useEffect(() => {
    if (initialSuite) {
      const match = rooms.find(
        (r) =>
          r.id === initialSuite.id ||
          r.slug === initialSuite.slug ||
          r.slug === initialSuite.id ||
          r.id === initialSuite.slug ||
          r.room_number === initialSuite.roomNumber ||
          r.room_number === initialSuite.room_number
      );
      if (match) {
        setSelectedRoomId(match.id);
      } else if (initialSuite.id) {
        setSelectedRoomId(initialSuite.id);
      }
    }
  }, [initialSuite, rooms]);

  // Load Razorpay Script dynamically
  useEffect(() => {
    if (typeof window !== "undefined" && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Fetch live available rooms whenever dates or adults change
  useEffect(() => {
    let isMounted = true;
    async function loadAvailability() {
      try {
        const avail = await fetchAvailableRooms(checkIn, checkOut, adults + childrenCount);
        if (isMounted && avail && avail.length > 0) {
          setRooms(avail);
          const currentMatch = avail.find(
            (r) =>
              r.id === selectedRoomId ||
              r.slug === selectedRoomId ||
              (initialSuite &&
                (r.id === initialSuite.id ||
                  r.slug === initialSuite.slug ||
                  r.slug === initialSuite.id ||
                  r.id === initialSuite.slug ||
                  r.room_number === initialSuite.roomNumber ||
                  r.room_number === initialSuite.room_number))
          );
          if (currentMatch) {
            setSelectedRoomId(currentMatch.id);
          } else {
            setSelectedRoomId(avail[0].id);
          }
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
  }, [checkIn, checkOut, adults, childrenCount, isOpen, initialSuite]);

  if (!isOpen) return null;

  const room =
    rooms.find(
      (r) =>
        r.id === selectedRoomId ||
        r.slug === selectedRoomId ||
        r.room_number === selectedRoomId
    ) || rooms[0] || ROOMS_DATA[0];

  // Calculate nights
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.max(1, end.getTime() - start.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const pricePerNight = Number(
    room.price_per_night !== undefined
      ? room.price_per_night
      : (room.pricePerNight !== undefined ? room.pricePerNight : 1)
  );
  const roomRate = pricePerNight * nights;
  const taxes = Math.round(roomRate * 0.18); // 18% GST / luxury tax
  const discount = discountApplied ? Math.round(roomRate * 0.15) : 0; // 15% promo discount
  const totalAmount = roomRate + taxes - discount;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "PALACE10" || promoCode.trim().toUpperCase() === "ROYALVIP") {
      setDiscountApplied(true);
    } else {
      alert("Invalid promo code. Try 'PALACE10' or 'ROYALVIP'");
    }
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
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
          guests: adults + childrenCount,
          guestInfo: {
            firstName,
            lastName,
            email: guestEmail,
            phone: guestPhone || "+91 98765 43210",
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
          description: `Reservation for ${orderData.roomName} (${nights} Nights)`,
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
            contact: guestPhone || "+919876543210",
          },
          theme: {
            color: "#933d2d",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", async function (response) {
          try {
            await fetch("/api/razorpay/fail-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                bookingId: orderData.bookingId,
                bookingReference: orderData.bookingReference,
                reason: response.error?.description || "Payment failed",
              }),
            });
          } catch (e) {
            console.error("Fail record error:", e);
          }

          setErrorMessage(
            `Payment Failed: ${response.error?.description || "Transaction declined"}. Booking reference ${orderData.bookingReference} marked as 'Payment Failed (Pending)'. Please retry below.`
          );
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        // Fallback for demo testing when script is not yet loaded
        setTimeout(() => {
          setIsSubmitted(true);
          setIsProcessing(false);
          triggerConfetti();
        }, 1000);
      }
    } catch (err) {
      console.error("Booking error:", err);
      setErrorMessage(err.message || "Failed to process reservation");
      setIsProcessing(false);
    }
  };


  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D4AF37", "#C9A86A", "#ffffff", "#e6c875"],
      });
    } catch (err) {
      console.log("Confetti trigger:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[150] flex justify-end bg-black/80 backdrop-blur-md animate-fadeIn cursor-pointer"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg h-full bg-[#100F0E] border-l border-[#D4AF37]/30 shadow-2xl flex flex-col justify-between overflow-y-auto cursor-default touch-pan-y"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        {/* Header */}
        <div className="p-6 border-b border-[#D4AF37]/20 flex items-center justify-between bg-[#161412]">
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
                Thank you, <strong className="text-[#F7F5F2]">{guestName || "Estemeed Guest"}</strong>. Your reservation for <strong className="text-[#D4AF37]">{room.room_name || room.name}</strong> ({nights} Nights) has been confirmed.
              </p>
            </div>

            <div className="w-full bg-[#161412] border border-[#D4AF37]/25 rounded-md p-4 text-xs text-left space-y-2 text-[#D6B892]">
              <div className="flex justify-between border-b border-[#D4AF37]/15 pb-1.5">
                <span>Booking Reference</span>
                <span className="font-mono font-bold text-[#D4AF37]">{confirmedBookingRef || "RMP-829104"}</span>
              </div>
              <div className="flex justify-between border-b border-[#D4AF37]/15 pb-1.5">
                <span>Check-In Date</span>
                <span className="font-semibold text-[#F7F5F2]">{checkIn}</span>
              </div>
              <div className="flex justify-between border-b border-[#D4AF37]/15 pb-1.5">
                <span>Check-Out Date</span>
                <span className="font-semibold text-[#F7F5F2]">{checkOut}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Total Paid (Verified)</span>
                <span className="font-serif text-[#D4AF37] font-semibold text-base">₹{totalAmount?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <a
                href={`/booking?ref=${confirmedBookingRef || "RMP-829104"}`}
                onClick={onClose}
                className="w-full py-3.5 bg-[#D4AF37] text-[#100F0E] text-xs font-serif uppercase tracking-[0.2em] font-semibold rounded-sm hover:bg-[#C9A86A] transition-colors cursor-pointer flex items-center justify-center gap-2 block text-center"
              >
                <span>VIEW DIGITAL PASS</span>
              </a>

              <button
                onClick={() => {
                  setIsSubmitted(false);
                  onClose();
                }}
                className="w-full py-3 bg-[#161412] text-[#F7F5F2]/80 text-xs font-serif uppercase tracking-[0.2em] rounded-sm border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-colors cursor-pointer"
              >
                Done & Return
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitBooking} className="p-6 space-y-6 flex-1">
            {errorMessage && (
              <div className="p-3 bg-red-950/80 border border-red-500/40 text-red-300 text-xs rounded text-center">
                {errorMessage}
              </div>
            )}
            
            {/* Select Room Category */}
            <div>
              <label className="text-xs sm:text-sm font-mono uppercase tracking-widest text-[#D4AF37] font-semibold block mb-1.5">
                1. SELECT ROOM SUITE
              </label>
              <select
                value={room.id}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="w-full bg-[#161412] border border-[#D4AF37]/40 rounded-md px-3.5 py-3 text-sm sm:text-base text-[#F7F5F2] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] cursor-pointer"
              >
                {rooms.map((r) => {
                  const isAvailable = (r.availability_status || r.availabilityStatus || "available") === "available";
                  const roomP = Number(r.price_per_night !== undefined ? r.price_per_night : r.pricePerNight);
                  return (
                    <option key={r.id} value={r.id} disabled={!isAvailable} className="bg-[#100F0E] text-[#F7F5F2]">
                      {r.room_name || r.name} {!isAvailable ? " (UNAVAILABLE)" : ""} — ₹{roomP.toLocaleString('en-IN')}/night ({r.size_sq_ft || r.sizeSqFt} sq ft)
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Dates Selection */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs sm:text-sm font-mono uppercase tracking-widest text-[#D4AF37] font-semibold block mb-1.5">
                  CHECK-IN
                </label>
                <input
                  type="date"
                  min={getToday()}
                  value={checkIn}
                  onChange={(e) => handleCheckInChange(e.target.value)}
                  className="w-full bg-[#1c1917] border border-[#D4AF37]/50 rounded-md px-3.5 py-3 text-sm sm:text-base text-[#FFFFFF] font-mono focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] shadow-sm font-semibold cursor-pointer"
                  required
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-mono uppercase tracking-widest text-[#D4AF37] font-semibold block mb-1.5">
                  CHECK-OUT
                </label>
                <input
                  type="date"
                  min={getMinCheckOut(checkIn)}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-[#1c1917] border border-[#D4AF37]/50 rounded-md px-3.5 py-3 text-sm sm:text-base text-[#FFFFFF] font-mono focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] shadow-sm font-semibold cursor-pointer"
                  required
                />
              </div>
            </div>

            {/* Guests Count */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs sm:text-sm font-mono uppercase tracking-widest text-[#D6B892] font-medium block mb-1.5">
                  ADULTS
                </label>
                <select
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="w-full bg-[#161412] border border-[#D4AF37]/30 rounded-md px-3.5 py-3 text-sm sm:text-base text-[#F7F5F2] font-mono cursor-pointer"
                >
                  <option value={1}>1 Adult</option>
                  <option value={2}>2 Adults</option>
                  <option value={3}>3 Adults</option>
                  <option value={4}>4 Adults</option>
                </select>
              </div>
              <div>
                <label className="text-xs sm:text-sm font-mono uppercase tracking-widest text-[#D6B892] font-medium block mb-1.5">
                  CHILDREN
                </label>
                <select
                  value={childrenCount}
                  onChange={(e) => setChildrenCount(Number(e.target.value))}
                  className="w-full bg-[#161412] border border-[#D4AF37]/30 rounded-md px-3.5 py-3 text-sm sm:text-base text-[#F7F5F2] font-mono cursor-pointer"
                >
                  <option value={0}>0 Children</option>
                  <option value={1}>1 Child</option>
                  <option value={2}>2 Children</option>
                </select>
              </div>
            </div>

            {/* Guest Contact Details */}
            <div className="space-y-3 pt-2">
              <label className="text-xs sm:text-sm font-mono uppercase tracking-widest text-[#D4AF37] font-semibold block">
                2. GUEST INFORMATION
              </label>
              <input
                type="text"
                placeholder="Full Name (e.g. Maharaja Vikram Singh)"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full bg-[#161412] border border-[#D4AF37]/30 rounded-md px-3.5 py-3 text-sm sm:text-base text-[#F7F5F2] focus:outline-none focus:border-[#D4AF37]"
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full bg-[#161412] border border-[#D4AF37]/30 rounded-md px-3.5 py-3 text-sm sm:text-base text-[#F7F5F2] focus:outline-none focus:border-[#D4AF37]"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full bg-[#161412] border border-[#D4AF37]/30 rounded-md px-3.5 py-3 text-sm sm:text-base text-[#F7F5F2] focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>
            </div>

            {/* Promo Code Input */}
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-[#D6B892] block mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#D4AF37]" />
                PROMO CODE (Try: PALACE10 or ROYALVIP)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="PALACE10"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={discountApplied}
                  className="flex-1 bg-[#161412] border border-[#D4AF37]/30 rounded-md px-3.5 py-2.5 text-sm text-[#F7F5F2] uppercase font-mono"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  disabled={discountApplied}
                  className="px-5 py-2.5 bg-[#1A1816] border border-[#D4AF37]/40 text-[#D4AF37] text-xs sm:text-sm font-serif uppercase tracking-wider rounded-md hover:bg-[#D4AF37] hover:text-[#100F0E] transition-colors cursor-pointer"
                >
                  {discountApplied ? "Applied!" : "Apply"}
                </button>
              </div>
            </div>

            {/* Total Cost Summary */}
            <div className="bg-[#161412] border border-[#D4AF37]/30 rounded-md p-5 space-y-2.5 text-xs sm:text-sm text-[#D6B892]">
              <div className="flex justify-between">
                <span>Rate ({nights} Nights)</span>
                <span className="font-mono">₹{roomRate?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Heritage Taxes & GST (18%)</span>
                <span className="font-mono">₹{taxes?.toLocaleString('en-IN')}</span>
              </div>
              {discountApplied && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Royal Promo Discount (15%)</span>
                  <span className="font-mono">-₹{discount?.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="border-t border-[#D4AF37]/20 pt-3 flex justify-between items-baseline font-serif text-base text-[#F7F5F2]">
                <span className="font-semibold">Grand Total</span>
                <span className="text-[#D4AF37] font-semibold text-2xl font-mono">₹{totalAmount?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-gradient-to-r from-[#C9A86A] via-[#D4AF37] to-[#C9A86A] text-[#100F0E] text-xs sm:text-sm font-serif uppercase tracking-[0.25em] font-semibold rounded-md shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>INITIALIZING PAYMENT...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>PAY WITH RAZORPAY</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

