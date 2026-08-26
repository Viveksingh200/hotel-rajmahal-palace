"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Calendar, User } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({
  onOpenBooking,
  onOpenDining,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const bookingCtx = useBooking();
  const { user, isAuthenticated, signInWithGoogle, signOut } = useAuth();
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleDiningClick = () => {
    if (onOpenDining) onOpenDining();
    else if (bookingCtx?.openDining) bookingCtx.openDining();
  };

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Rooms", href: "/rooms" },
    { name: "Dining", href: "/dining" },
    { name: "Experience", href: "/experience" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-4 sm:px-8 ${scrolled
          ? `bg-[#12100E]/98 backdrop-blur-2xl py-3 shadow-[0_15px_40px_rgba(0,0,0,0.9)] ${!mobileMenuOpen ? "border-b border-[#D4AF37]/30" : ""}`
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
                    data-cursor={link.name.toUpperCase()}
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
                  data-cursor={link.name.toUpperCase()}
                  className={`text-[11px] tracking-[0.22em] font-serif uppercase transition-all py-1 relative ${isActive ? "text-[#D4AF37] font-semibold" : "text-[#F7F5F2]/80 hover:text-[#D4AF37]"
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

          {/* Right Action Buttons ("BOOK NOW" & Login Profile) */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              href="/rooms"
              data-cursor="RESERVE"
              className="bg-black/50 hover:bg-[#D4AF37] text-[#F7F5F2] hover:text-[#100F0E] font-serif text-[11px] font-semibold tracking-[0.25em] uppercase px-7 py-2.5 rounded-full border border-[#D4AF37]/80 shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300 inline-flex items-center justify-center cursor-pointer"
            >
              BOOK NOW
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  data-cursor="ACCOUNT"
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-[#D4AF37] hover:bg-amber-400 text-[#100F0E] font-bold text-sm font-mono shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all cursor-pointer"
                  title={user?.email || "Profile"}
                >
                  {user?.email?.[0]?.toUpperCase() || "G"}
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-48 bg-[#181614]/95 backdrop-blur-xl border border-[#D4AF37]/30 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] py-2 overflow-hidden z-50"
                    >
                      <div className="px-4 py-2 border-b border-[#D4AF37]/10 mb-1">
                        <p className="text-[#F7F5F2] text-xs font-serif truncate">{user?.email}</p>
                      </div>
                      <Link
                        href="/booking?tab=lookup"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="block px-4 py-2.5 text-sm text-[#F7F5F2]/80 hover:text-[#D4AF37] hover:bg-white/5 transition-colors font-serif"
                      >
                        My Stays
                      </Link>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          signOut();
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-400/80 hover:text-red-400 hover:bg-white/5 transition-colors font-serif cursor-pointer"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="bg-white/10 hover:bg-white/20 text-[#F7F5F2] font-serif text-[11px] tracking-wider uppercase px-4 py-2 rounded-full border border-white/20 hover:border-[#D4AF37] transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Google Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile View Toggle */}
          <div className="flex lg:hidden items-center space-x-2 sm:space-x-3">
            {isAuthenticated ? (
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="flex items-center justify-center w-7 h-7 rounded-full bg-[#D4AF37] text-[#100F0E] font-bold text-[11px] font-mono shadow-md cursor-pointer"
                title={user?.email || "Profile"}
              >
                {user?.email?.[0]?.toUpperCase() || "G"}
              </button>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="bg-white/10 text-[#F7F5F2] font-serif text-[10px] tracking-wider uppercase px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1"
              >
                <User className="w-3 h-3 text-[#D4AF37]" />
                <span>Login</span>
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#F7F5F2] p-1.5 focus:outline-none"
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
            className="fixed inset-0 z-40 bg-[#100F0E]/98 backdrop-blur-xl flex flex-col justify-between pt-20 pb-12 px-6 border-b border-[#D4AF37]/30 lg:hidden"
          >
            <div className="flex flex-col space-y-4">
              {isAuthenticated && (
                <div className="flex flex-row items-center pb-1 border-b border-[#D4AF37]/20">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-[#100F0E] font-bold text-xl flex items-center justify-center font-mono shadow-md mb-1 shrink-0">
                    {user?.email?.[0]?.toUpperCase() || "G"}
                  </div>
                  <p className="text-[#F7F5F2] text-sm font-serif truncate w-full px-2">{user?.email}</p>
                </div>
              )}

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

                {isAuthenticated && (
                  <>
                    <div className="h-[1px] bg-[#D4AF37]/20 my-2"></div>
                    <Link
                      href="/booking?tab=lookup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-left text-lg font-serif tracking-wider uppercase transition-colors py-2 px-3 rounded text-[#D4AF37] hover:bg-white/5"
                    >
                      My Stays
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut();
                      }}
                      className="text-left text-lg font-serif tracking-wider uppercase transition-colors py-2 px-3 rounded text-red-400 hover:bg-white/5 cursor-pointer"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <Link
                href="/rooms"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-[#D4AF37] text-[#100F0E] font-serif tracking-widest py-3.5 rounded-full border border-[#D4AF37]/40 text-center flex items-center justify-center gap-2 shadow-lg font-semibold cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>BOOK NOW</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

