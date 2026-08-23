"use client";

import { useEffect, useState } from "react";
import { Crown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader({ progress = 0, isReady = false, onComplete }) {
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (isReady && progress >= 100) {
      const timer = setTimeout(() => {
        setComplete(true);
        if (onComplete) onComplete();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isReady, progress, onComplete]);

  if (complete) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#100F0E] text-[#F7F5F2] selection:bg-[#D4AF37] selection:text-[#100F0E]"
      >
        {/* Background Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/15 via-transparent to-transparent pointer-events-none" />

        {/* Regal Logo & Tagline */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-16 h-16 rounded-full bg-[#1A1816] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mb-4 shadow-[0_0_30px_rgba(212,175,55,0.3)]"
          >
            <Crown className="w-8 h-8 animate-pulse" />
          </motion.div>

          <span className="text-xs uppercase tracking-[0.4em] text-[#D6B892] font-semibold mb-1">
            HERITAGE SANCTUARY & RESORT
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#F7F5F2] tracking-wider uppercase">
            HOTEL RAJMAHAL PALACE
          </h1>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-3" />
        </div>

        {/* Progress Bar & Percentage */}
        <div className="relative z-10 w-64 sm:w-80 flex flex-col items-center space-y-3">
          <div className="w-full h-1 bg-[#1A1816] rounded-full overflow-hidden border border-[#D4AF37]/20">
            <motion.div
              className="h-full bg-gradient-to-r from-[#C9A86A] via-[#D4AF37] to-[#C9A86A]"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>

          <div className="flex items-center justify-between w-full text-xs font-mono tracking-widest text-[#D6B892]">
            <span>LOADING ASSETS</span>
            <span className="text-[#D4AF37] font-semibold">{Math.floor(progress)}%</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
