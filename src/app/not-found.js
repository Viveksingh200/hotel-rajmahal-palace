"use client";

import React from "react";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream text-charcoal flex flex-col items-center justify-center p-6 text-center pt-24">
      <span className="text-xs uppercase tracking-[0.4em] text-sandstone font-bold block mb-2">
        404 — PAGE NOT FOUND
      </span>
      <h1 className="text-4xl sm:text-6xl font-serif text-charcoal mb-4">
        Serene Passage Not Found
      </h1>
      <div className="w-20 h-0.5 bg-gold mx-auto mb-6" />
      <p className="text-base font-serif italic text-sandstone/90 max-w-md mb-8">
        The requested page could not be located in our palace directory.
      </p>

      <Link
        href="/"
        className="bg-sandstone hover:bg-sandstone-dark text-cream font-serif text-xs tracking-widest uppercase px-8 py-4 rounded border border-gold/40 flex items-center gap-2 shadow-lg transition-all"
      >
        <Home className="w-4 h-4 text-gold" />
        <span>RETURN TO HOMEPAGE</span>
      </Link>
    </div>
  );
}
