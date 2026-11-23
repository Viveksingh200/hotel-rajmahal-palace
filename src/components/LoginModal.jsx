"use client";

import React from "react";
import { X, Crown, ShieldCheck, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, signInWithGoogle, isRedirecting } = useAuth();
  const { openBookingDrawer } = useBooking();

  if (!isLoginModalOpen) return null;

  const handleContinueAsGuest = () => {
    closeLoginModal();
    if (openBookingDrawer) {
      openBookingDrawer();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLoginModal}
          className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-md bg-[#12100E] text-[#F7F5F2] border border-[#D4AF37]/40 rounded-2xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle Ambient Gold Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            type="button"
            onClick={closeLoginModal}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-[#D6B892] hover:text-white flex items-center justify-center transition-colors border border-white/10 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="text-center space-y-2.5 pt-1">
            <div className="w-14 h-14 rounded-full bg-[#1A1816] border-2 border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] mx-auto shadow-[0_0_25px_rgba(212,175,55,0.3)]">
              <Crown className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] font-mono tracking-[0.28em] text-[#D4AF37] uppercase block font-semibold">
                HOTEL RAJMAHAL PALACE
              </span>
              <h2 className="text-xl sm:text-2xl font-serif text-[#F7F5F2] tracking-wide mt-1">
                Sign In to Reserve
              </h2>
            </div>

            <p className="text-xs sm:text-[13px] text-[#D6B892]/80 font-serif leading-relaxed px-2">
              Sign in with your Google account to confirm your room reservation, manage your booking, and receive an instant official voucher.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            {/* Google Login Button */}
            <button
              type="button"
              disabled={isRedirecting}
              onClick={() => signInWithGoogle()}
              className="w-full py-3.5 px-4 bg-white hover:bg-zinc-100 text-[#100F0E] font-medium text-sm rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-75 disabled:cursor-wait"
            >
              {isRedirecting ? (
                <>
                  <Loader2 className="w-5 h-5 text-[#100F0E] animate-spin" />
                  <span className="font-semibold text-xs tracking-wider uppercase font-serif">Connecting to Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="font-semibold text-xs tracking-wider uppercase font-serif">Continue with Google</span>
                </>
              )}
            </button>

            {/* Direct Guest Booking Option */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleContinueAsGuest}
                className="text-[11px] sm:text-xs text-[#D6B892]/70 hover:text-[#D4AF37] font-serif underline underline-offset-4 tracking-wider transition-colors cursor-pointer"
              >
                Or Continue to View Room Availability →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
