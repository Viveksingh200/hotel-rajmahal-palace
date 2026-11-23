"use client";

import React, { useState } from "react";
import Image from "next/image";
import LocationSection from "@/components/LocationSection";
import { HOTEL_INFO } from "@/data/hotel";
import { Phone, Mail, MapPin, Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/send-inquiry-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to send inquiry");
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error("Inquiry submission error:", err);
      setErrorMsg("Failed to send your message. Please try again or call us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-cream text-charcoal">
      {/* Banner */}
      <div className="relative min-h-[320px] sm:h-[420px] w-full flex flex-col items-center justify-center text-center overflow-hidden mb-12 sm:mb-16 pt-24 sm:pt-28 pb-8 sm:pb-12 px-3 sm:px-4">
        <Image
          src="/images/contact.jpeg"
          alt="Contact Hotel Rajmahal Palace"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/45 to-black/60 sm:to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-2 sm:px-4 text-cream space-y-2.5 sm:space-y-3">
          <span className="text-[9.5px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.4em] text-gold font-medium block">
            GET IN TOUCH
          </span>
          <h1 className="text-2xl sm:text-6xl font-serif text-white tracking-tight">
            Contact Concierge
          </h1>
          <div className="w-12 sm:w-20 h-0.5 bg-gold mx-auto" />
          <p className="text-xs sm:text-lg font-serif italic text-[#D4AF37] max-w-xl mx-auto bg-[#100F0E]/80 py-1.5 px-3 sm:px-4 rounded-xl sm:rounded-full">
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
              <a
                href={HOTEL_INFO.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="none"
                className="flex items-start gap-4 group cursor-pointer hover:bg-white/5 p-2 rounded-lg -m-2 transition-colors"
              >
                <div className="w-11 h-11 rounded-full bg-[#181614] text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center shrink-0 group-hover:bg-[#D4AF37] group-hover:text-[#100F0E] group-hover:scale-110 transition-all duration-300 shadow-md">
                  <MapPin className="w-5 h-5 text-current" />
                </div>
                <div>
                  <span className="font-semibold text-white block font-serif flex items-center gap-1.5 group-hover:text-[#D4AF37] transition-colors">
                    Address <span className="text-[10px] text-[#D4AF37] font-sans font-normal"></span>
                  </span>
                  <span className="text-xs text-cream/80 leading-relaxed block mt-0.5">{HOTEL_INFO.address}</span>
                </div>
              </a>

              <a
                href={`tel:${HOTEL_INFO.phone.replace(/\s+/g, "")}`}
                data-cursor="none"
                className="flex items-start gap-4 group cursor-pointer hover:bg-white/5 p-2 rounded-lg -m-2 transition-colors"
              >
                <div className="w-11 h-11 rounded-full bg-[#181614] text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center shrink-0 group-hover:bg-[#D4AF37] group-hover:text-[#100F0E] group-hover:scale-110 transition-all duration-300 shadow-md">
                  <Phone className="w-5 h-5 text-current" />
                </div>
                <div>
                  <span className="font-semibold text-white block font-serif flex items-center gap-1.5 group-hover:text-[#D4AF37] transition-colors">
                    Phone <span className="text-[10px] text-[#D4AF37] font-sans font-normal"></span>
                  </span>
                  <span className="text-xs text-cream/80 block mt-0.5">{HOTEL_INFO.phone}</span>
                </div>
              </a>

              <a
                href={`mailto:${HOTEL_INFO.email}`}
                data-cursor="none"
                className="flex items-start gap-4 group cursor-pointer hover:bg-white/5 p-2 rounded-lg -m-2 transition-colors"
              >
                <div className="w-11 h-11 rounded-full bg-[#181614] text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center shrink-0 group-hover:bg-[#D4AF37] group-hover:text-[#100F0E] group-hover:scale-110 transition-all duration-300 shadow-md">
                  <Mail className="w-5 h-5 text-current" />
                </div>
                <div>
                  <span className="font-semibold text-white block font-serif flex items-center gap-1.5 group-hover:text-[#D4AF37] transition-colors">
                    Email <span className="text-[10px] text-[#D4AF37] font-sans font-normal"></span>
                  </span>
                  <span className="text-xs text-cream/80 block mt-0.5">{HOTEL_INFO.email}</span>
                </div>
              </a>
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
                    placeholder="+91 98XXXXXXXX"
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

                {errorMsg && (
                  <div className="p-3 bg-red-950/20 border border-red-500/40 rounded text-xs text-red-600 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  data-cursor="SEND"
                  className="w-full sm:w-auto bg-[#F0AF02]/80 disabled:opacity-50 disabled:cursor-not-allowed text-[#100F0E] font-serif text-xs font-bold tracking-wider sm:tracking-widest uppercase px-6 sm:px-8 py-3 sm:py-3.5 rounded shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:scale-[1.02] flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#100F0E]" />
                      <span>SENDING INQUIRY...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#100F0E]" />
                      <span>SEND INQUIRY</span>
                    </>
                  )}
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
