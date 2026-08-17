"use client";

import React from "react";
import { MapPin, Navigation, Compass, Phone, Mail } from "lucide-react";
import { HOTEL_INFO } from "@/data/hotel";

export default function LocationSection() {
  return (
    <section id="location" className="py-24 bg-cream-muted text-charcoal relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.35em] text-sandstone font-semibold block mb-2">
            DESTINATION
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-charcoal tracking-tight mb-3">
            FIND YOUR ESCAPE
          </h2>
          <div className="w-20 h-0.5 bg-gold mx-auto mb-4" />
          <p className="text-base text-charcoal/70 font-sans">
            Nestled peacefully along Palace Road in the serene hill ridge of Rajasthan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Info Card */}
          <div className="lg:col-span-5 bg-charcoal text-cream rounded-lg p-8 border border-gold/30 flex flex-col justify-between shadow-xl">
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-gold block mb-1">LOCATION</span>
                <h3 className="text-2xl font-serif text-white">{HOTEL_INFO.name}</h3>
                <p className="text-sm text-cream/70 mt-1">{HOTEL_INFO.address}</p>
              </div>

              <div className="w-full h-px bg-white/10" />

              <div className="space-y-4 text-sm font-sans">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block font-serif">Hillside Position</span>
                    <span className="text-xs text-cream/70">Elevated ridge overviewing green mist-clad valleys.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Navigation className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block font-serif">Travel Assistance</span>
                    <span className="text-xs text-cream/70">Complimentary private car valet & airport transfer options.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block font-serif">Concierge Contact</span>
                    <span className="text-xs text-cream/70">{HOTEL_INFO.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 mt-6">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-sandstone hover:bg-sandstone-dark text-cream font-serif text-xs tracking-widest uppercase py-3.5 rounded-sm border border-gold/40 text-center flex items-center justify-center gap-2 transition-colors block"
              >
                <Compass className="w-4 h-4 text-gold" />
                <span>OPEN IN GOOGLE MAPS</span>
              </a>
            </div>
          </div>

          {/* Interactive Map Placeholder Card */}
          <div className="lg:col-span-7 bg-cream rounded-lg border border-sandstone/20 overflow-hidden shadow-xl relative min-h-[380px] flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(#933d2d_1px,transparent_1px)] [background-size:16px_16px]">
            <div className="absolute inset-0 bg-cream/90" />
            <div className="relative z-10 max-w-md space-y-4">
              <div className="w-16 h-16 rounded-full bg-sandstone/10 border border-sandstone/30 flex items-center justify-center mx-auto text-sandstone">
                <MapPin className="w-8 h-8 text-sandstone" />
              </div>
              <h4 className="text-2xl font-serif text-charcoal">Hotel Rajmahal Palace</h4>
              <p className="text-xs text-charcoal/70 font-mono bg-cream-muted px-3 py-1 rounded border border-sandstone/10 inline-block">
                Lat: 26.9124° N, Lng: 75.7873° E
              </p>
              <p className="text-sm text-charcoal/80">
                Surrounded by peaceful hills, lush greenery, and distant traditional village slopes.
              </p>
              <div className="pt-2">
                <span className="text-xs uppercase tracking-widest text-gold bg-charcoal text-cream px-4 py-2 rounded-full border border-gold/40">
                  Palace Estate Interactive Location
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
