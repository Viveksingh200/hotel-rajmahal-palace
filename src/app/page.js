"use client";

import { useState, useEffect } from "react";
import Lenis from "lenis";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/components/CustomCursor";
import CinematicCanvasScroll from "@/components/CinematicCanvasScroll";
import SuiteModal from "@/components/SuiteModal";
import DiningModal from "@/components/DiningModal";
import BookingDrawer from "@/components/BookingDrawer";
import RoomsSection from "@/components/RoomsSection";
import ExperienceSection from "@/components/ExperienceSection";
import DiningSection from "@/components/DiningSection";
import GalleryLightbox from "@/components/GalleryLightbox";
import AboutSection from "@/components/AboutSection";
import LocationSection from "@/components/LocationSection";
import { Calendar, Compass, Sparkles, ArrowRight } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Consume central BookingContext
  const {
    isSuiteOpen,
    openSuites,
    closeSuites,
    isDiningOpen,
    openDining,
    closeDining,
    isBookingDrawerOpen,
    openBookingDrawer,
    closeBookingDrawer,
    selectedRoom,
    startBookingForRoom,
  } = useBooking();

  // Lenis smooth scrolling instance
  const [lenisInstance, setLenisInstance] = useState(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    setLenisInstance(lenis);

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Lock scroll when any modal or drawer is active
  const isAnyModalOpen =
    isSuiteOpen || isDiningOpen || isBookingDrawerOpen;

  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      if (lenisInstance) lenisInstance.stop();
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (lenisInstance) lenisInstance.start();
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (lenisInstance) lenisInstance.start();
    };
  }, [isAnyModalOpen, lenisInstance]);

  return (
    <main className="relative min-h-screen bg-[#100F0E] text-[#F7F5F2] selection:bg-[#D4AF37] selection:text-[#100F0E]">
      {/* 1. Regal Preloader */}
      <Preloader
        progress={loadProgress}
        isReady={isReady}
        onComplete={() => {}}
      />

      {/* 2. Custom Golden Trailing Cursor */}
      <CustomCursor />

      {/* 3. 3D Storytelling Cinematic Canvas Engine (240 Native Frames Scrubber) */}
      <CinematicCanvasScroll
        onProgress={(p) => setLoadProgress(p)}
        onReady={() => setIsReady(true)}
        onOpenSuites={openSuites}
        onOpenDining={openDining}
        onOpenBooking={openBookingDrawer}
      />

      {/* 4. ROOMS SHOWCASE */}
      <div id="rooms" className="py-16">
        <RoomsSection />
      </div>

      {/* 5. EXPERIENCE & HILLS */}
      <div id="experience">
        <ExperienceSection />
      </div>

      {/* 6. DINING SHOWCASE */}
      <div id="dining">
        <DiningSection />
      </div>

      {/* 7. PALACE GALLERY */}
      <section className="py-24 bg-[#100F0E] text-[#F7F5F2] border-t border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.35em] text-[#D4AF37] font-semibold block mb-2">
                VISUAL ESSENCE
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif text-[#F7F5F2] tracking-tight">
                PALACE GALLERY
              </h2>
              <div className="w-20 h-0.5 bg-[#D4AF37] mt-3" />
            </div>

            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-[#D6B892] hover:text-[#D4AF37] font-serif text-sm tracking-wider uppercase font-semibold mt-4 md:mt-0 group"
            >
              <span>EXPLORE FULL GALLERY</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <GalleryLightbox showFilter={false} limit={6} />
        </div>
      </section>

      {/* 8. ABOUT & LOCATION */}
      <AboutSection />
      <LocationSection />

      {/* 9. FINAL RESERVATION CTA */}
      <section className="py-24 bg-[#141210] text-[#F7F5F2] relative overflow-hidden text-center border-t border-[#D4AF37]/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
          <span className="text-xs uppercase tracking-[0.4em] text-[#D4AF37] font-medium block">
            RESERVE YOUR SANCTUARY
          </span>
          <h2 className="text-4xl sm:text-6xl font-serif text-white tracking-tight">
            YOUR PALACE ESCAPE AWAITS
          </h2>
          <div className="w-24 h-0.5 bg-[#D4AF37] mx-auto my-4" />
          <p className="text-lg font-serif italic text-[#D6B892]/90 max-w-xl mx-auto">
            &ldquo;Step into warm royal hospitality, dark marble comfort, and serene balcony hill views.&rdquo;
          </p>

          <div className="pt-6 flex items-center justify-center">
            <button
              onClick={() => openBookingDrawer()}
              className="bg-gradient-to-r from-[#C9A86A] via-[#D4AF37] to-[#C9A86A] text-[#100F0E] font-serif text-xs font-semibold tracking-widest uppercase px-10 py-5 rounded-sm border border-[#D4AF37]/50 shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-3 cursor-pointer"
            >
              <Calendar className="w-5 h-5 text-[#100F0E]" />
              <span>BOOK YOUR STAY</span>
            </button>
          </div>
        </div>
      </section>

      {/* 10. Modals & Drawers */}
      <SuiteModal
        isOpen={isSuiteOpen}
        onClose={closeSuites}
        onSelectSuite={(suite) => {
          closeSuites();
          startBookingForRoom(suite);
        }}
      />

      <DiningModal
        isOpen={isDiningOpen}
        onClose={closeDining}
        onOpenBooking={() => {
          closeDining();
          openBookingDrawer();
        }}
      />

      <BookingDrawer
        isOpen={isBookingDrawerOpen}
        onClose={closeBookingDrawer}
        initialSuite={selectedRoom}
      />
    </main>
  );
}
