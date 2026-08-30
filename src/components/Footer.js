"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HOTEL_INFO } from "@/data/hotel";
import { Calendar, Phone, Mail, MapPin } from "lucide-react";
import { useBooking } from "@/context/BookingContext";

export default function Footer() {
  const pathname = usePathname();
  const { openBookingDrawer } = useBooking();

  if (pathname?.startsWith("/admin")) {
    return null;
  }


  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Rooms", href: "/rooms" },
    { name: "Experience", href: "/experience" },
    { name: "Dining", href: "/dining" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <footer className="bg-charcoal text-cream pt-16 pb-8 border-t border-sandstone/30 relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-block group">
              <span className="text-xs uppercase tracking-[0.3em] text-gold font-medium block">HOTEL</span>
              <span className="text-2xl font-serif tracking-wider text-cream group-hover:text-gold transition-colors">
                RAJMAHAL PALACE
              </span>
            </Link>

            <div className="w-16 h-0.5 bg-gold" />

            <p className="text-sm text-cream/70 leading-relaxed font-sans max-w-sm">
              An Indian heritage-inspired resort surrounded by hills, lush greenery, and serene natural surroundings. Where royal grandeur meets quiet mountain rest.
            </p>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href={HOTEL_INFO.instagramUrl || "https://www.instagram.com/rajmahalpalace04"}
                target="_blank"
                rel="noreferrer"
                data-cursor="none"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#100F0E] border border-white/10 hover:border-[#D4AF37] transition-all duration-300 flex items-center justify-center group cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
              >
                <svg
                  className="w-4 h-4 text-current group-hover:scale-110 transition-transform stroke-current fill-none stroke-[1.75]"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                data-cursor="none"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#100F0E] border border-white/10 hover:border-[#D4AF37] transition-all duration-300 flex items-center justify-center group cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
              >
                <svg
                  className="w-4 h-4 text-current group-hover:scale-110 transition-transform stroke-current fill-none stroke-[1.75]"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                data-cursor="none"
                aria-label="Twitter / X"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#100F0E] border border-white/10 hover:border-[#D4AF37] transition-all duration-300 flex items-center justify-center group cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
              >
                <svg
                  className="w-3.5 h-3.5 text-current group-hover:scale-110 transition-transform fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.3em] text-gold font-serif font-semibold">
              QUICK LINKS
            </h4>
            <div className="w-10 h-0.5 bg-gold/40 mb-4" />

            <ul className="space-y-2 text-sm font-serif">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-cream/70 hover:text-gold transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info & CTA */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.3em] text-gold font-serif font-semibold">
              RESERVATIONS & CONTACT
            </h4>
            <div className="w-10 h-0.5 bg-gold/40 mb-4" />

            <div className="space-y-3 text-xs text-cream/80 font-sans">
              <a
                href={HOTEL_INFO.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 hover:text-gold transition-colors group"
              >
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span>{HOTEL_INFO.address}</span>
              </a>
              <a
                href={`tel:${HOTEL_INFO.phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-2.5 hover:text-gold transition-colors"
              >
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <span>{HOTEL_INFO.phone}</span>
              </a>
              <a
                href={`mailto:${HOTEL_INFO.email}`}
                data-cursor="none"
                className="flex items-center gap-2.5 hover:text-gold transition-colors"
              >
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <span>{HOTEL_INFO.email}</span>
              </a>
            </div>

            <div className="pt-2">
              <button
                onClick={() => openBookingDrawer()}
                data-cursor="RESERVE"
                className="w-full bg-gradient-to-r from-[#C9A86A] via-[#D4AF37] to-[#C9A86A] text-[#100F0E] font-serif text-xs font-bold tracking-widest uppercase py-3 rounded-sm border border-gold/40 shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:scale-[1.02] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#100F0E]" />
                <span>BOOK YOUR STAY</span>
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-cream/50 gap-4">
          <p>© {new Date().getFullYear()} Hotel Rajmahal Palace. All rights reserved.</p>
          <p className="font-serif italic text-gold/80">Experience Timeless Royal Heritage</p>
        </div>
      </div>
    </footer>
  );
}
