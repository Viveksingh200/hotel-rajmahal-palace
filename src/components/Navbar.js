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
    { name: "Home", href: "/" },
    { name: "Rooms", href: "/rooms" },
    { name: "Dining", onClick: handleDiningClick, href: "/dining" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled
            ? "bg-[#100F0E]/95 backdrop-blur-md shadow-2xl py-3 border-b border-[#D4AF37]/20"
            : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
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

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              if (link.onClick) {
                return (
                  <button
                    key={link.name}
                    onClick={link.onClick}
                    className="text-xs tracking-widest uppercase font-medium text-[#F7F5F2]/90 hover:text-[#D4AF37] transition-colors py-1 cursor-pointer"
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
                  className={`text-xs tracking-widest uppercase font-medium transition-all duration-300 relative py-1 ${
                    isActive ? "text-[#D4AF37] font-semibold" : "text-[#F7F5F2]/90 hover:text-[#D4AF37]"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Button */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={handleBookingClick}
              className="bg-gradient-to-r from-[#C9A86A] via-[#D4AF37] to-[#C9A86A] hover:opacity-95 text-[#100F0E] font-serif text-xs font-semibold tracking-widest px-6 py-2.5 rounded-sm border border-[#D4AF37]/40 shadow-lg hover:shadow-[#D4AF37]/40 transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#100F0E]" />
              <span>BOOK YOUR STAY</span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={handleBookingClick}
              className="bg-[#D4AF37] text-[#100F0E] text-[11px] font-serif tracking-widest px-3 py-1.5 rounded-sm border border-[#D4AF37]/40 flex items-center gap-1 font-semibold"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>BOOK</span>
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
            className="fixed inset-0 z-40 bg-[#100F0E]/98 backdrop-blur-xl flex flex-col justify-between pt-24 pb-12 px-6 border-b border-[#D4AF37]/30 md:hidden"
          >
            <div className="flex flex-col space-y-6">
              <div className="text-center pb-4 border-b border-[#D4AF37]/20">
                <span className="text-xs uppercase tracking-[0.4em] text-[#D4AF37] block mb-1">HOTEL</span>
                <span className="text-2xl font-serif text-[#F7F5F2]">RAJMAHAL PALACE</span>
                <p className="text-xs text-[#D6B892]/70 italic mt-1">Heritage & Hillside Serenity</p>
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
                className="w-full bg-[#D4AF37] text-[#100F0E] font-serif tracking-widest py-3.5 rounded-sm border border-[#D4AF37]/40 text-center flex items-center justify-center gap-2 shadow-lg font-semibold cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>BOOK YOUR STAY</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
