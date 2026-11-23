"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { useBooking } from "@/context/BookingContext";

export default function SmoothScroll({ children }) {
  const pathname = usePathname();
  const lenisRef = useRef(null);
  const { isSuiteOpen, isDiningOpen, isBookingDrawerOpen } = useBooking();

  const isAnyModalOpen = isSuiteOpen || isDiningOpen || isBookingDrawerOpen;
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    if (typeof window !== "undefined") {
      window.__lenis = lenis;
    }

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      if (typeof window !== "undefined") {
        window.__lenis = null;
      }
    };
  }, []);

  // Handle route change: scroll to top
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  // Lock/Unlock scroll when modal or drawer is active
  useEffect(() => {
    if (isAnyModalOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      if (lenisRef.current) lenisRef.current.stop();

      return () => {
        const top = document.body.style.top;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        if (top) {
          const scrollVal = parseInt(top || "0", 10) * -1;
          window.scrollTo(0, scrollVal);
          if (lenisRef.current) {
            lenisRef.current.scrollTo(scrollVal, { immediate: true });
          }
        }
        if (lenisRef.current) lenisRef.current.start();
      };
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (lenisRef.current) lenisRef.current.start();
    }
  }, [isAnyModalOpen]);

  return <>{children}</>;
}
