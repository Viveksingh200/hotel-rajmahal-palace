"use client";

import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const [hoverState, setHoverState] = useState({ active: false, label: "" });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const handleMouseOver = (e) => {
      const target = e.target.closest("[data-cursor]");
      if (target) {
        const label = target.getAttribute("data-cursor") || "EXPLORE";
        setHoverState({ active: true, label });
      } else {
        setHoverState({ active: false, label: "" });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    let animFrame;
    const followCursor = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.35;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.35;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animFrame = requestAnimationFrame(followCursor);
    };

    animFrame = requestAnimationFrame(followCursor);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-[9990]">
      {/* Center Gold Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-[#D4AF37] rounded-full transition-opacity duration-200 pointer-events-none will-change-transform"
        style={{
          opacity: hoverState.active ? 0 : 1,
        }}
      />

      {/* Outer Ring & Hover Badge */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 border rounded-full flex items-center justify-center pointer-events-none will-change-transform transition-[width,height,background-color,border-color,box-shadow,opacity] duration-300 ease-out ${
          hoverState.active
            ? "w-24 h-24 bg-[#D4AF37]/20 backdrop-blur-sm border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.5)]"
            : "w-10 h-10 border-[#D6B892]/40"
        }`}
      >
        {hoverState.active && (
          <span className="text-[10px] tracking-[0.2em] font-serif text-[#F7F5F2] uppercase font-semibold animate-pulse">
            {hoverState.label}
          </span>
        )}
      </div>
    </div>
  );
}
