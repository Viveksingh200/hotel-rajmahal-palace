"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Calendar } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({
  onOpenBooking,
  onOpenDining,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const bookingCtx = useBooking();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBookingClick = () => {
    if (onOpenBooking) onOpenBooking();
    else if (bookingCtx?.openBookingDrawer) bookingCtx.openBookingDrawer();
    else if (bookingCtx?.openBookingModal) bookingCtx.openBookingModal("available");
  };

  const handleDiningClick = () => {
    if (onOpenDining) onOpenDining();
    else if (bookingCtx?.openDining) bookingCtx.openDining();
  };

  const navLinks = [
    { name: "About", href: "/#about" },
    { name: "Rooms", href: "/rooms" },
    { name: "Dining", onClick: handleDiningClick, href: "/dining" },
    { name: "Experience", href: "/experience" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-4 sm:px-8 ${
          scrolled
            ? "bg-[#12100E]/98 backdrop-blur-2xl border-b border-[#D4AF37]/30 py-3 shadow-[0_15px_40px_rgba(0,0,0,0.9)]"
            : "bg-gradient-to-b from-[#12100E]/95 via-[#12100E]/60 to-transparent pt-4 pb-6"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex flex-col focus:outline-none">
            <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold group-hover:text-amber-300 transition-colors">
              HOTEL
            </span>
            <span className="text-xl sm:text-2xl font-serif tracking-wider text-[#F7F5F2] group-hover:text-white transition-colors">
              RAJMAHAL PALACE
            </span>
            <span className="h-[1px] w-full bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/70 to-[#D4AF37]/0 group-hover:via-[#D4AF37] transition-all duration-300"></span>
          </Link>

          {/* Center Floating Pill Nav Container */}
          <nav className="hidden lg:flex items-center bg-[#181614]/85 backdrop-blur-xl border border-[#D4AF37]/35 px-8 py-2.5 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.7)] space-x-7 sm:space-x-8">
            {navLinks.map((link) => {
              if (link.onClick) {
                return (
                  <button
                    key={link.name}
                    onClick={link.onClick}
                    className="text-[11px] tracking-[0.22em] font-serif uppercase text-[#F7F5F2]/80 hover:text-[#D4AF37] transition-all py-1 cursor-pointer"
                  >
                    {link.name}
                  </button>
                );
              }
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[11px] tracking-[0.22em] font-serif uppercase transition-all py-1 relative ${
                    isActive ? "text-[#D4AF37] font-semibold" : "text-[#F7F5F2]/80 hover:text-[#D4AF37]"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#D4AF37]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Button ("BOOK NOW") */}
          <div className="hidden lg:flex items-center">
            <button
              onClick={handleBookingClick}
              className="bg-black/50 hover:bg-[#D4AF37] text-[#F7F5F2] hover:text-[#100F0E] font-serif text-[11px] font-semibold tracking-[0.25em] uppercase px-7 py-2.5 rounded-full border border-[#D4AF37]/80 shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300 cursor-pointer"
            >
              BOOK NOW
            </button>
          </div>

          {/* Mobile View Toggle */}
          <div className="flex lg:hidden items-center space-x-3">
            <button
              onClick={handleBookingClick}
              className="bg-black/50 hover:bg-[#D4AF37] text-[#F7F5F2] hover:text-[#100F0E] text-[10px] font-serif tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border border-[#D4AF37]/70 font-semibold"
            >
              BOOK NOW
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#F7F5F2] p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#D4AF37]" /> : <Menu className="w-6 h-6 text-[#F7F5F2]" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-[#100F0E]/98 backdrop-blur-xl flex flex-col justify-between pt-24 pb-12 px-6 border-b border-[#D4AF37]/30 lg:hidden"
          >
            <div className="flex flex-col space-y-6">
              <div className="text-center pb-4 border-b border-[#D4AF37]/20 flex flex-col items-center">
                <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold mb-1">
                  HOTEL
                </span>
                <span className="text-2xl font-serif tracking-wider text-[#F7F5F2]">
                  RAJMAHAL PALACE
                </span>
              </div>

              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => {
                  if (link.onClick) {
                    return (
                      <button
                        key={link.name}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          link.onClick();
                        }}
                        className="text-left text-lg font-serif tracking-wider uppercase transition-colors py-2 px-3 rounded text-[#F7F5F2]/90 hover:text-[#D4AF37] hover:bg-white/5 cursor-pointer"
                      >
                        {link.name}
                      </button>
                    );
                  }
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-left text-lg font-serif tracking-wider uppercase transition-colors py-2 px-3 rounded text-[#F7F5F2]/90 hover:text-[#D4AF37] hover:bg-white/5"
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleBookingClick();
                }}
                className="w-full bg-[#D4AF37] text-[#100F0E] font-serif tracking-widest py-3.5 rounded-full border border-[#D4AF37]/40 text-center flex items-center justify-center gap-2 shadow-lg font-semibold cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>BOOK NOW</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

