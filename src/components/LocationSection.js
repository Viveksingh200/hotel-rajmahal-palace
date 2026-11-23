"use client";

import React, { useState } from "react";
import { MapPin, Navigation, Compass, Phone, ExternalLink, Route, Layers } from "lucide-react";
import { HOTEL_INFO } from "@/data/hotel";

export default function LocationSection() {
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <section id="location" className="py-24 bg-cream-muted text-charcoal relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-sandstone font-semibold block mb-2">
            DESTINATION
          </span>
          <h2 className="text-2xl sm:text-5xl font-serif text-charcoal tracking-tight mb-3">
            FIND YOUR ESCAPE
          </h2>
          <div className="w-16 sm:w-20 h-0.5 bg-gold mx-auto mb-4" />
          <p className="text-base text-charcoal/70 font-sans">
            Conveniently located on Pune-Nashik Highway (NH 60) with scenic hillside ambiance and seamless road connectivity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Info Card */}
          <div className="lg:col-span-5 bg-charcoal text-cream rounded-xl p-8 border border-gold/30 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            {/* Subtle luxury glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] uppercase tracking-widest text-gold font-medium">LOCATION & CONTACT</span>
                  <span className="h-px flex-1 bg-gold/30" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif text-white">{HOTEL_INFO.name}</h3>
                <p className="text-sm text-cream/80 mt-2 font-sans leading-relaxed">
                  {HOTEL_INFO.address}
                </p>
              </div>

              <div className="w-full h-px bg-white/10" />

              <div className="space-y-4 text-sm font-sans">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0 text-gold">
                    <Route className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block font-serif">NH 60 Highway Access</span>
                    <span className="text-xs text-cream/70 leading-normal block mt-0.5">
                      Prime accessibility on Pune–Nashik Highway (NH 60) at Shirgaon, Khed.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0 text-gold">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block font-serif">Bhimashankar & Sahyadri Gateway</span>
                    <span className="text-xs text-cream/70 leading-normal block mt-0.5">
                      Comfortable transit point for Bhimashankar Jyotirlinga, scenic nature drives, and Pune city.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0 text-gold">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block font-serif">Front Desk & Concierge</span>
                    <span className="text-xs text-cream/70 block mt-0.5">{HOTEL_INFO.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 mt-6 relative z-10 space-y-2">
              <a
                href={HOTEL_INFO.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-[#C9A86A] via-[#D4AF37] to-[#C9A86A] text-[#100F0E] font-serif text-[11px] sm:text-xs font-bold tracking-wider sm:tracking-widest uppercase py-3 sm:py-3.5 px-3 rounded-lg border border-gold/40 text-center flex items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:scale-[1.01]"
              >
                <Compass className="w-4 h-4 text-[#100F0E] shrink-0" />
                <span>OPEN IN GOOGLE MAPS</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#100F0E] shrink-0" />
              </a>
              <span className="text-[11px] text-cream/50 text-center block">
                Get real-time driving directions from your location
              </span>
            </div>
          </div>

          {/* Right: Embedded Interactive Google Map */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-sandstone/30 overflow-hidden shadow-2xl flex flex-col relative min-h-[460px]">

            {/* Map iframe container */}
            <div className="relative flex-1 w-full min-h-[380px] bg-cream-muted">
              {!mapLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-cream-muted text-charcoal/70 z-0 p-4 text-center">
                  <div className="w-10 h-10 border-2 border-sandstone border-t-gold rounded-full animate-spin mb-3" />
                  <span className="text-xs font-serif tracking-wider uppercase text-charcoal">Loading Google Maps...</span>
                  <span className="text-[11px] text-charcoal/60 mt-1">Hotel Rajmahal Palace, Shirgaon, NH 60</span>
                </div>
              )}

              <iframe
                title="Hotel Rajmahal Palace Location Map"
                src={HOTEL_INFO.embedMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setMapLoaded(true)}
                className="absolute inset-0 w-full h-full z-[1]"
              />
            </div>

            {/* Bottom info banner */}
            <div className="p-4 bg-cream border-t border-sandstone/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs z-10">
              <div>
                <p className="font-serif font-semibold text-charcoal">
                  Hotel Rajmahal Palace, Shirgaon, Near Bhimashankar, NH 60, Tal Khed, Dist. Pune - 412402
                </p>
                <p className="text-[11px] text-charcoal/70 mt-0.5">
                  Shirgaon &bull; Khed &bull; Pune District &bull; Maharashtra
                </p>
              </div>
              <a
                href={HOTEL_INFO.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 bg-charcoal hover:bg-black text-gold hover:text-white px-4 py-2 rounded font-serif text-[11px] tracking-wider uppercase border border-gold/40 transition-colors shrink-0"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
