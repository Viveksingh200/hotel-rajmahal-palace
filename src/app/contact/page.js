"use client";

import React, { useState } from "react";
import Image from "next/image";
import LocationSection from "@/components/LocationSection";
import { HOTEL_INFO } from "@/data/hotel";
import { Phone, Mail, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="w-full bg-cream text-charcoal pb-20">
      {/* Banner */}
      <div className="relative h-[320px] sm:h-[420px] w-full flex items-center justify-center text-center overflow-hidden mb-16">
        <Image
          src="/images/entrance.jpg"
          alt="Contact Hotel Rajmahal Palace"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-cream space-y-3 pt-14">
          <span className="text-xs uppercase tracking-[0.4em] text-gold font-medium block">
            GET IN TOUCH
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif text-white tracking-tight">
            Contact Concierge
          </h1>
          <div className="w-20 h-0.5 bg-gold mx-auto" />
          <p className="text-base sm:text-lg font-serif italic text-[#D4AF37] max-w-xl mx-auto bg-[#100F0E]/80 py-1 px-2 rounded-full">
            &ldquo;We look forward to welcoming you to the serenity of the hills.&rdquo;
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-charcoal text-cream rounded-lg p-8 border border-gold/30 shadow-xl space-y-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-gold block font-serif mb-1">
                HERITAGE RESORT
              </span>
              <h2 className="text-3xl font-serif text-white">{HOTEL_INFO.name}</h2>
              <p className="text-xs text-cream/70 italic mt-1 font-serif">{HOTEL_INFO.tagline}</p>
            </div>

            <div className="w-full h-px bg-white/10" />

            <div className="space-y-6 text-sm font-sans">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-sandstone/20 text-gold border border-gold/30 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-semibold text-white block font-serif">Address</span>
                  <span className="text-xs text-cream/80">{HOTEL_INFO.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-sandstone/20 text-gold border border-gold/30 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-semibold text-white block font-serif">Phone</span>
                  <span className="text-xs text-cream/80">{HOTEL_INFO.phone}</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-sandstone/20 text-gold border border-gold/30 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-semibold text-white block font-serif">Email</span>
                  <span className="text-xs text-cream/80">{HOTEL_INFO.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-lg border border-sandstone/20 shadow-xl">
            <h3 className="text-2xl font-serif text-charcoal mb-2">Send an Inquiry</h3>
            <p className="text-xs text-charcoal/70 mb-6 font-sans">
              Fill out the form below and our royal concierge desk will respond promptly.
            </p>

            {submitted ? (
              <div className="p-8 bg-cream-muted rounded-lg border border-gold/40 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-sandstone mx-auto" />
                <h4 className="text-2xl font-serif text-charcoal">Thank You!</h4>
                <p className="text-sm text-charcoal/80">
                  Your message has been received. Our concierge team will reach out to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-serif uppercase tracking-widest text-sandstone underline pt-2 block mx-auto"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-serif uppercase tracking-wider text-charcoal">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-cream-muted border border-sandstone/20 rounded px-3.5 py-2.5 text-sm focus:outline-none focus:border-sandstone"
                      placeholder="Your Name"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-serif uppercase tracking-wider text-charcoal">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-cream-muted border border-sandstone/20 rounded px-3.5 py-2.5 text-sm focus:outline-none focus:border-sandstone"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-serif uppercase tracking-wider text-charcoal">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-cream-muted border border-sandstone/20 rounded px-3.5 py-2.5 text-sm focus:outline-none focus:border-sandstone"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-serif uppercase tracking-wider text-charcoal">
                    Message / Special Inquiry *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-cream-muted border border-sandstone/20 rounded px-3.5 py-2.5 text-sm focus:outline-none focus:border-sandstone"
                    placeholder="Tell us about your upcoming trip or preferences..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="bg-sandstone hover:bg-sandstone-dark text-cream font-serif text-xs tracking-widest uppercase px-8 py-3.5 rounded border border-gold/40 shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4 text-gold" />
                  <span>SEND INQUIRY</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <LocationSection />
    </div>
  );
}
