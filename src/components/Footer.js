"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HOTEL_INFO } from "@/data/hotel";
import { useBooking } from "@/context/BookingContext";
import { Calendar, Phone, Mail, MapPin, Share2, Globe, Compass } from "lucide-react";

export default function Footer() {
  const { openBookingModal } = useBooking();
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }


  const quickLinks = [
    { name: "Home", href: "/" },
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

            {/* Social Icons (Inline SVG for reliability) */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-sandstone text-cream/80 hover:text-white border border-white/10 hover:border-gold transition-colors flex items-center justify-center"
              >
                <Globe className="w-4 h-4 text-gold" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-sandstone text-cream/80 hover:text-white border border-white/10 hover:border-gold transition-colors flex items-center justify-center"
              >
                <Compass className="w-4 h-4 text-gold" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Share"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-sandstone text-cream/80 hover:text-white border border-white/10 hover:border-gold transition-colors flex items-center justify-center"
              >
                <Share2 className="w-4 h-4 text-gold" />
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
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>{HOTEL_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <span>{HOTEL_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <span>{HOTEL_INFO.email}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => openBookingModal("available")}
                className="w-full bg-sandstone hover:bg-sandstone-dark text-cream font-serif text-xs tracking-widest uppercase py-3 rounded-sm border border-gold/40 shadow-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Calendar className="w-4 h-4 text-gold" />
                <span>BOOK YOUR STAY</span>
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-cream/50 gap-4">
          <p>© {new Date().getFullYear()} Hotel Rajmahal Palace. All rights reserved.</p>
          <p className="font-serif italic text-gold/60">Frontend Luxury Hospitality Prototype</p>
        </div>
      </div>
    </footer>
  );
}
