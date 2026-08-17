"use client";

import { useState } from "react";
import { Plus, Info, ArrowUpRight } from "lucide-react";

export default function InteractiveHotspot({
  top = "50%",
  left = "50%",
  title = "Feature Name",
  subtitle = "Crafted with royal elegance",
  tag = "PALACE HIGHLIGHT",
  onClick = null,
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="absolute z-30 transition-transform duration-300 hover:scale-110"
      style={{ top, left }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor="EXPLORE"
    >
      {/* Outer Pulse Rings */}
      <div className="relative flex items-center justify-center">
        <span className="absolute w-9 h-9 rounded-full bg-[#C9A86A]/40 animate-ping" />
        <span className="absolute w-14 h-14 rounded-full bg-[#D6B892]/20 animate-pulse" />

        {/* Center Hotspot Button */}
        <button
          onClick={() => {
            if (onClick) onClick();
            else setHovered(!hovered);
          }}
          className="relative w-8 h-8 rounded-full bg-[#100F0E]/85 backdrop-blur-md border border-[#D4AF37] text-[#D4AF37] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.6)] hover:bg-[#D4AF37] hover:text-[#100F0E] transition-all cursor-pointer"
          aria-label={title}
        >
          <Plus className={`w-4 h-4 transition-transform duration-300 ${hovered ? "rotate-45" : ""}`} />
        </button>
      </div>

      {/* Floating Glass Tooltip Card */}
      {hovered && (
        <div 
          onClick={() => onClick && onClick()}
          className="absolute left-1/2 bottom-12 -translate-x-1/2 w-64 p-4 rounded-lg bg-[#100F0E]/95 backdrop-blur-xl border border-[#D4AF37]/40 shadow-[0_15px_40px_rgba(0,0,0,0.8)] text-left animate-fadeIn pointer-events-auto cursor-pointer group"
        >
          <div className="flex items-center justify-between gap-1.5 mb-1 text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase">
            <span className="flex items-center gap-1">
              <Info className="w-3 h-3 text-[#C9A86A]" />
              {tag}
            </span>
            <ArrowUpRight className="w-3 h-3 text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h4 className="font-serif text-base text-[#F7F5F2] font-semibold leading-tight mb-1 group-hover:text-[#D4AF37] transition-colors">
            {title}
          </h4>
          <p className="text-xs text-[#D6B892]/80 font-light leading-relaxed">
            {subtitle}
          </p>
        </div>
      )}
    </div>
  );
}
