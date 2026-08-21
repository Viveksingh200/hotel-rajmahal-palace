"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, CheckCircle2, Calendar, ShieldCheck, Printer, User, Mail, Phone, Lock, Sparkles, Clock } from "lucide-react";
import BookingWidget from "@/components/BookingWidget";
import RoomsSection from "@/components/RoomsSection";
import { fetchBookingByReference, fetchUserBookings } from "@/lib/bookingService";
import { useAuth } from "@/context/AuthContext";

export default function BookingPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("search"); // 'search' | 'my-stays'
  const [searchRef, setSearchRef] = useState("");
  const [userBookings, setUserBookings] = useState([]);
  const [singleResult, setSingleResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Auto-fetch user bookings on load or when user logs in
  useEffect(() => {
    async function loadAutomaticBookings() {
      let recentRefs = [];
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("rajmahal_recent_refs");
          if (stored) recentRefs = JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }

        const urlParams = new URLSearchParams(window.location.search);
        const refParam = urlParams.get("ref");
        const tabParam = urlParams.get("tab");

        if (tabParam === "lookup" || refParam) {
          setActiveTab("my-stays");
        }

        if (refParam) {
          recentRefs.push(refParam);
        }
      }

      setIsLoading(true);
      try {
        const bookings = await fetchUserBookings(user?.email, recentRefs);
        setUserBookings(bookings || []);
      } catch (err) {
        console.error("Error loading automatic user bookings:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadAutomaticBookings();
  }, [user]);

  const handleManualSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchRef || !searchRef.trim()) return;
    setIsLoading(true);
    setSearched(true);
    try {
      const result = await fetchBookingByReference(searchRef);
      setSingleResult(result);
    } catch (err) {
      console.error("Manual search error:", err);
      setSingleResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="w-full bg-cream text-charcoal pb-20 min-h-screen">
      {/* Subpage Banner Header */}
      <div className="relative h-[320px] sm:h-[420px] w-full flex items-center justify-center text-center overflow-hidden mb-16">
        <Image
          src="/images/rooms.png"
          alt="Palace Reservations Header"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-cream space-y-4 pt-12">
          <span className="text-xs uppercase tracking-[0.4em] text-gold font-medium block">
            ROYAL RESERVATIONS
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif text-white tracking-tight">
            My Palace Stays
          </h1>
          <div className="w-20 h-0.5 bg-gold mx-auto" />
          <p className="text-sm sm:text-base font-serif italic text-[#D4AF37] max-w-xl mx-auto leading-relaxed bg-[#100F0E]/80 py-1 px-2 rounded-full">
            &ldquo;Your confirmed stays and digital reservation passes, retrieved automatically.&rdquo;
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs Container */}
        <div className="flex justify-center mb-14">
          <div className="inline-flex p-1.5 bg-charcoal text-cream rounded-full border border-gold/30 shadow-2xl z-10">
            <button
              onClick={() => setActiveTab("search")}
              className={`px-7 py-3 rounded-full text-xs font-serif tracking-widest uppercase transition-all cursor-pointer ${activeTab === "search"
                ? "bg-gradient-to-r from-sandstone to-sandstone-dark text-white shadow-lg font-semibold"
                : "text-cream/70 hover:text-gold"
                }`}
            >
              Reserve New Stay
            </button>
            <button
              onClick={() => setActiveTab("my-stays")}
              className={`px-7 py-3 rounded-full text-xs font-serif tracking-widest uppercase transition-all cursor-pointer flex items-center gap-2 ${activeTab === "my-stays"
                ? "bg-gradient-to-r from-sandstone to-sandstone-dark text-white shadow-lg font-semibold"
                : "text-cream/70 hover:text-gold"
                }`}
            >
              <Calendar className="w-4 h-4 text-gold" />
              <span>My Stays ({userBookings.length})</span>
            </button>
          </div>
        </div>

        {activeTab === "search" ? (
          <div className="space-y-16">
            <BookingWidget />
            <RoomsSection />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Automatic Bookings Section */}
            {isLoading ? (
              <div className="bg-white p-12 rounded-xl border border-gold/30 text-center space-y-4 shadow-xl">
                <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-serif tracking-widest text-charcoal/70 uppercase">
                  Retrieving Your Confirmed Stays...
                </p>
              </div>
            ) : userBookings.length > 0 ? (
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-sandstone/20 pb-4">
                  <h3 className="text-2xl sm:text-3xl font-serif text-charcoal">
                    Your Confirmed Reservations ({userBookings.length})
                  </h3>
                  <button
                    onClick={handlePrint}
                    className="px-5 py-2.5 bg-charcoal text-gold text-xs font-serif uppercase tracking-wider rounded-md border border-gold/40 flex items-center gap-2 transition-colors cursor-pointer hover:bg-black shadow-md"
                  >
                    <Printer className="w-4 h-4 text-gold" />
                    <span>Print Pass Vouchers</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  {userBookings.map((b) => (
                    <div
                      key={b.id || b.booking_reference}
                      className="bg-white rounded-xl border-2 border-gold/40 shadow-2xl overflow-hidden animate-fade-in"
                    >
                      {/* Banner */}
                      <div className="bg-gradient-to-r from-charcoal via-[#1C1A17] to-charcoal text-cream p-6 sm:p-8 border-b border-gold/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                              {b.booking_status === "confirmed" ? "Confirmed & Verified" : b.booking_status?.toUpperCase()}
                            </span>
                          </div>
                          <h4 className="text-2xl sm:text-3xl font-serif text-white">
                            {b.room?.room_name || b.room?.name || "Heritage Room Suite"}
                          </h4>
                          <p className="text-xs font-serif text-gold mt-1">
                            Reference ID: <span className="font-mono text-white">{b.booking_reference}</span>
                          </p>
                        </div>

                        <div className="text-right bg-black/50 px-5 py-2.5 rounded-lg border border-gold/30 shadow-inner">
                          <span className="text-[10px] uppercase font-serif text-gold block tracking-widest">
                            Total Paid
                          </span>
                          <span className="text-xl font-mono text-white font-bold">
                            ₹{Number(b.total_amount || 0).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-charcoal">
                        <div className="space-y-2.5 bg-cream-muted p-5 rounded-lg border border-sandstone/15">
                          <h5 className="text-[11px] font-serif uppercase tracking-widest text-sandstone font-bold border-b border-sandstone/15 pb-2">
                            Guest Details
                          </h5>
                          <div className="flex justify-between pt-1">
                            <span className="text-charcoal/70">Guest Name:</span>
                            <span className="font-semibold text-charcoal">{b.customer_name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-charcoal/70">Contact Email:</span>
                            <span className="font-mono">{b.customer_email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-charcoal/70">Phone Number:</span>
                            <span className="font-mono">{b.customer_phone}</span>
                          </div>
                        </div>

                        <div className="space-y-2.5 bg-cream-muted p-5 rounded-lg border border-sandstone/15">
                          <h5 className="text-[11px] font-serif uppercase tracking-widest text-sandstone font-bold border-b border-sandstone/15 pb-2">
                            Stay Schedule
                          </h5>
                          <div className="flex justify-between pt-1">
                            <span className="text-charcoal/70">Check-In:</span>
                            <span className="font-semibold text-charcoal">{b.check_in} (From 2:00 PM)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-charcoal/70">Check-Out:</span>
                            <span className="font-semibold text-charcoal">{b.check_out} (Until 11:00 AM)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-charcoal/70">Payment ID:</span>
                            <span className="font-mono">{b.razorpay_payment_id || "VERIFIED"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Fallback Search Input Box */}
                <div className="bg-charcoal text-cream p-8 sm:p-10 rounded-xl border border-gold/30 shadow-2xl space-y-5 text-center">
                  <Clock className="w-10 h-10 text-gold mx-auto" />
                  <div className="space-y-1.5">
                    <h3 className="text-2xl font-serif text-gold">No Saved Stays Detected</h3>
                    <p className="text-xs text-cream/70 font-sans max-w-md mx-auto leading-relaxed">
                      No active bookings were automatically found for your current session. Enter your Booking Reference (e.g. RMP-923019) or Email to retrieve your pass:
                    </p>
                  </div>

                  <form onSubmit={handleManualSearch} className="flex flex-col sm:flex-row gap-3 pt-3 max-w-xl mx-auto">
                    <input
                      type="text"
                      placeholder="Booking Reference (e.g. RMP-923019 or Email)"
                      value={searchRef}
                      onChange={(e) => setSearchRef(e.target.value)}
                      className="flex-1 bg-[#12100E] border border-gold/40 rounded-lg px-4 py-3.5 text-sm text-white focus:outline-none focus:border-gold font-mono shadow-inner"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-8 py-3.5 bg-gradient-to-r from-gold via-gold-light to-gold text-charcoal font-serif text-xs font-semibold uppercase tracking-widest rounded-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                    >
                      <Search className="w-4 h-4" />
                      <span>SEARCH</span>
                    </button>
                  </form>
                </div>

                {/* Single Lookup Result */}
                {searched && (
                  <div>
                    {singleResult ? (
                      <div className="bg-white rounded-xl border-2 border-gold/40 shadow-2xl overflow-hidden animate-fade-in">
                        <div className="bg-gradient-to-r from-charcoal via-[#1C1A17] to-charcoal text-cream p-6 border-b border-gold/30 flex justify-between items-center">
                          <div>
                            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
                              ✓ Verified Reservation
                            </span>
                            <h4 className="text-2xl font-serif text-white">
                              {singleResult.room?.room_name || singleResult.room?.name || "Palace Suite"}
                            </h4>
                            <p className="text-xs font-serif text-gold">Ref: {singleResult.booking_reference}</p>
                          </div>
                          <button
                            onClick={handlePrint}
                            className="px-4 py-2 bg-white/10 text-cream text-xs font-serif uppercase tracking-wider rounded border border-gold/40"
                          >
                            Print Pass
                          </button>
                        </div>

                        <div className="p-6 grid grid-cols-2 gap-4 text-xs text-charcoal">
                          <div>
                            <strong>Guest:</strong> {singleResult.customer_name} ({singleResult.customer_email})
                          </div>
                          <div>
                            <strong>Dates:</strong> {singleResult.check_in} to {singleResult.check_out}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl border border-red-200 p-8 text-center space-y-2">
                        <Lock className="w-8 h-8 text-red-500 mx-auto" />
                        <h4 className="text-lg font-serif text-charcoal font-semibold">Reservation Not Found</h4>
                        <p className="text-xs text-charcoal/70">No booking matched reference &ldquo;{searchRef}&rdquo;.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
