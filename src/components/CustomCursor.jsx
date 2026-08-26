"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { useBooking } from "@/context/BookingContext";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isInitialized = useRef(false);

  const { isSuiteOpen, isDiningOpen, isBookingDrawerOpen } = useBooking();
  const isAnyModalOpen = isSuiteOpen || isDiningOpen || isBookingDrawerOpen;

  const [hoverState, setHoverState] = useState({
    active: false,
    label: "",
    isInput: false,
  });
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const pathname = usePathname();

  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    // Detect touch / mobile device
    if (typeof window !== "undefined") {
      const isTouch =
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0;
      setIsTouchDevice(isTouch);
    }
  }, []);

  useEffect(() => {
    if (isAdmin || isTouchDevice || isAnyModalOpen) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;

      if (!isInitialized.current) {
        mousePos.current = { x: clientX, y: clientY };
        ringPos.current = { x: clientX, y: clientY };
        isInitialized.current = true;
      } else {
        mousePos.current = { x: clientX, y: clientY };
      }

      setIsVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseOver = (e) => {
      if (!e.target) return;

      // 1. Inside forms, modals, drawers, input fields, images, or media viewers: ALWAYS suppress custom badge
      const formArea = e.target.closest(
        "form, input, select, textarea, label, [data-form], [data-no-cursor], [data-lenis-prevent], .lightbox-viewer, img, picture"
      );
      if (formArea && !e.target.closest("button, a, [data-cursor]")) {
        setHoverState({ active: false, label: "", isInput: true });
        return;
      }

      // 2. Check for explicit custom data-cursor label on buttons or links
      const targetWithData = e.target.closest("[data-cursor]");
      if (targetWithData) {
        const label = targetWithData.getAttribute("data-cursor");
        if (label && label !== "none" && label !== "default") {
          setHoverState({ active: true, label: label.trim().toUpperCase(), isInput: false });
          return;
        } else {
          setHoverState({ active: false, label: "", isInput: false });
          return;
        }
      }

      // 3. Only trigger on genuine navigation links, primary action buttons, or clickable room cards
      const interactive = e.target.closest(
        "a, button, [role='button'], [data-interactive]"
      );

      if (interactive) {
        const rawText = (
          interactive.getAttribute("aria-label") ||
          interactive.getAttribute("title") ||
          interactive.innerText ||
          interactive.textContent ||
          ""
        ).trim();
        const text = rawText.toLowerCase();
        const href = (interactive.getAttribute("href") || "").toLowerCase();

        let label = "";

        // Exclude social media links from hotel action labels
        const isSocial =
          href.includes("facebook.com") ||
          href.includes("instagram.com") ||
          href.includes("twitter.com") ||
          href.includes("x.com") ||
          href.includes("wa.me") ||
          href.includes("whatsapp") ||
          text.includes("facebook") ||
          text.includes("instagram") ||
          text.includes("twitter");

        if (isSocial) {
          setHoverState({ active: false, label: "", isInput: false });
          return;
        }

        if (
          text.includes("close") ||
          text.includes("cancel") ||
          text.includes("dismiss") ||
          text.includes("esc") ||
          interactive.querySelector("svg.lucide-x") ||
          interactive.getAttribute("aria-label")?.toLowerCase().includes("close")
        ) {
          label = "CLOSE";
        } else if (
          (/\b(book|reserve|reservation)\b/i.test(text) ||
            href.includes("/rooms") ||
            text.includes("book your stay")) &&
          !text.includes("facebook")
        ) {
          label = "RESERVE";
        } else if (
          /\bview\b/i.test(rawText) ||
          text.includes("detail")
        ) {
          label = "VIEW";
        } else if (
          text.includes("dine") ||
          text.includes("dining") ||
          text.includes("menu") ||
          text.includes("restaurant") ||
          href.includes("/dining")
        ) {
          label = "DINE";
        } else if (
          text.includes("contact") ||
          text.includes("call") ||
          text.includes("email") ||
          text.includes("phone") ||
          href.includes("/contact") ||
          href.startsWith("tel:") ||
          href.startsWith("mailto:")
        ) {
          label = "CONNECT";
        } else if (
          text.includes("gallery") ||
          text.includes("photo") ||
          href.includes("/gallery")
        ) {
          label = "GALLERY";
        } else if (
          text.includes("about") ||
          text.includes("story") ||
          href.includes("/about")
        ) {
          label = "ABOUT";
        } else if (
          text.includes("tour") ||
          text.includes("experience") ||
          text.includes("visit") ||
          href.includes("/experience")
        ) {
          label = "DISCOVER";
        } else if (
          text.includes("direction") ||
          text.includes("map") ||
          text.includes("location") ||
          href.includes("google.com/maps")
        ) {
          label = "MAP";
        } else if (
          text.includes("search") ||
          text.includes("availability")
        ) {
          label = "SEARCH";
        } else if (
          text.includes("send") ||
          text.includes("inquiry") ||
          text.includes("submit")
        ) {
          label = "SEND";
        } else if (rawText.length > 0 && rawText.length <= 18 && !rawText.includes("\n")) {
          label = rawText.toUpperCase();
        }

        if (label) {
          setHoverState({ active: true, label, isInput: false });
        } else {
          setHoverState({ active: false, label: "", isInput: false });
        }
      } else {
        setHoverState({ active: false, label: "", isInput: false });
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    let animFrame;
    const followCursor = () => {
      // Fluid trailing lerp physics
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.28;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.28;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      animFrame = requestAnimationFrame(followCursor);
    };

    animFrame = requestAnimationFrame(followCursor);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animFrame);
    };
  }, [isAdmin, isTouchDevice, isAnyModalOpen]);

  if (isAdmin || isTouchDevice || isAnyModalOpen) return null;

  return (
    <div
      className={`hidden lg:block pointer-events-none fixed inset-0 z-[999999] select-none transition-opacity duration-300 ${
        isVisible && !hoverState.isInput ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      {/* 1. Small Gold Center Dot (Fades out when hovered to reveal the frosted glass badge) */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-[3px] -mt-[3px] w-1.5 h-1.5 bg-[#D4AF37] rounded-full pointer-events-none will-change-transform shadow-[0_0_8px_#D4AF37] transition-opacity duration-200"
        style={{
          transform: `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`,
          opacity: hoverState.active ? 0 : 1,
        }}
      />

      {/* 2. Frosted Glass Luxury Circular Badge (Compact 80px) */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 -ml-10 -mt-10 w-20 h-20 flex items-center justify-center pointer-events-none will-change-transform"
        style={{
          transform: `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`,
        }}
      >
        <div
          className={`w-full h-full rounded-full flex items-center justify-center text-center transition-all duration-300 ease-out border ${
            hoverState.active
              ? `scale-100 opacity-100 bg-[#1e1a14]/80 backdrop-blur-md border-[#D4AF37] shadow-[0_10px_30px_rgba(0,0,0,0.65),0_0_20px_rgba(212,175,55,0.25)] ${
                  isClicking ? "scale-90" : "scale-100"
                }`
              : `scale-[0.38] bg-transparent border-[#D4AF37]/40 shadow-none ${
                  isClicking ? "scale-[0.28] border-[#D4AF37]" : ""
                }`
          }`}
        >
          {hoverState.active && (
            <span className="text-[9px] font-serif uppercase tracking-[0.2em] text-[#F7F5F2] font-semibold select-none px-1.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] transition-all duration-200 animate-fadeIn">
              {hoverState.label || "EXPLORE"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
