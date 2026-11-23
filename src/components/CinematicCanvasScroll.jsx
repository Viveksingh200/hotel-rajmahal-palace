"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// 720 Continuous Frames from the 3 video zips
const FRAME_URLS = Array.from(
  { length: 720 },
  (_, i) => `/frames/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`
);
const TOTAL_FRAMES = FRAME_URLS.length; // 720 frames

export default function CinematicCanvasScroll({
  onProgress,
  onReady,
  onOpenSuites,
  onOpenDining,
  onOpenBooking,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);

  const currentFrameRef = useRef(0);

  const [frameIndex, setFrameIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [heroAnimated, setHeroAnimated] = useState(false);

  const onProgressRef = useRef(onProgress);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onProgressRef.current = onProgress;
    onReadyRef.current = onReady;
  });

  // Mask reveal animation trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroAnimated(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Preload native Hotel Rajmahal Palace frames (720 frames) - RUNS ONCE ON MOUNT
  useEffect(() => {
    let loadedCount = 0;
    let lastReportedPercent = -1;
    const loadedImages = new Array(TOTAL_FRAMES);

    let currentIndex = 0;
    const BATCH_SIZE = 30;

    const loadNextBatch = () => {
      if (currentIndex >= TOTAL_FRAMES) return;

      const batchEnd = Math.min(TOTAL_FRAMES, currentIndex + BATCH_SIZE);
      let batchCompleted = 0;
      const totalInBatch = batchEnd - currentIndex;

      for (let i = currentIndex; i < batchEnd; i++) {
        const img = new Image();
        img.src = FRAME_URLS[i];

        const handleImageLoad = () => {
          loadedCount++;
          batchCompleted++;
          loadedImages[i] = img;
          imagesRef.current = loadedImages;

          const prog = Math.floor((loadedCount / TOTAL_FRAMES) * 100);
          if (prog !== lastReportedPercent) {
            lastReportedPercent = prog;
            if (onProgressRef.current) onProgressRef.current(prog);
          }

          if (i === 0) {
            renderFrame(0);
          }

          if (loadedCount >= TOTAL_FRAMES) {
            setImagesLoaded(true);
            renderFrame(0);
            if (onReadyRef.current) onReadyRef.current();
          }

          if (batchCompleted >= totalInBatch) {
            currentIndex = batchEnd;
            if (typeof window !== "undefined" && "requestIdleCallback" in window) {
              window.requestIdleCallback(loadNextBatch, { timeout: 60 });
            } else {
              setTimeout(loadNextBatch, 10);
            }
          }
        };

        if (img.complete) {
          handleImageLoad();
        } else {
          img.onload = img.onerror = handleImageLoad;
        }
      }
    };

    loadNextBatch();
  }, []);

  // Instant High-Precision Canvas Drawing Engine
  const renderFrame = (idx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let img = imagesRef.current[idx];

    // Fallback to nearest loaded frame if target frame is downloading
    if (!img || !img.complete) {
      for (let offset = 1; offset < 40; offset++) {
        if (imagesRef.current[idx - offset]?.complete) {
          img = imagesRef.current[idx - offset];
          break;
        }
        if (imagesRef.current[idx + offset]?.complete) {
          img = imagesRef.current[idx + offset];
          break;
        }
      }
    }

    if (!img || !img.complete) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.naturalWidth || img.width;
    const imgHeight = img.naturalHeight || img.height;

    const ratio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
    const newWidth = imgWidth * ratio;
    const newHeight = imgHeight * ratio;
    const offsetX = (canvasWidth - newWidth) / 2;
    const offsetY = (canvasHeight - newHeight) / 2;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);
  };

  // Resize listener for High-DPI Canvas
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const dpr = Math.max(1, window.devicePixelRatio || 1);
        canvasRef.current.width = Math.floor(window.innerWidth * dpr);
        canvasRef.current.height = Math.floor(window.innerHeight * dpr);
        renderFrame(currentFrameRef.current);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [imagesLoaded]);

  // Direct 1:1 Hardware Sync ScrollTrigger
  useEffect(() => {
    if (!imagesLoaded || !containerRef.current) return;

    let lastFrame = -1;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const frame = Math.min(
          TOTAL_FRAMES - 1,
          Math.max(0, Math.floor(self.progress * (TOTAL_FRAMES - 1)))
        );

        if (frame !== lastFrame) {
          lastFrame = frame;
          currentFrameRef.current = frame;
          setFrameIndex(frame);
          renderFrame(frame);
        }
      },
    });

    renderFrame(currentFrameRef.current || 0);

    return () => {
      trigger.kill();
    };
  }, [imagesLoaded]);

  return (
    <div ref={containerRef} className="relative w-full h-[900vh] bg-[#100F0E]">
      {/* Sticky Canvas & Viewport Wrapper */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        {/* Render Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-300"
        />

        {/* Ambient Vignette Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#100F0E]/30 to-[#100F0E]/85 pointer-events-none z-10" />

        {/* ---------------------------------------------------- */}
        {/* SCENE 1 (Frames 0 - 90): EXTERIOR (HERO OPENING)     */}
        {/* ---------------------------------------------------- */}
        <div
          className={`absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-3 sm:px-6 pt-16 sm:pt-0 transition-all duration-500 ${
            frameIndex >= 0 && frameIndex < 90
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <h1 className="font-serif text-2xl min-[360px]:text-3xl sm:text-7xl lg:text-9xl text-[#F7F5F2] tracking-wider font-medium sm:font-normal uppercase leading-[1.05] sm:leading-[0.95] drop-shadow-2xl mb-3 sm:mb-6 flex flex-col items-center select-none w-full bg-[#100F0E]/80 md:bg-transparent rounded-xl md:rounded-none">
            <span className="block overflow-hidden py-1 w-full">
              <motion.span
                initial={{ y: "150%", opacity: 0 }}
                animate={heroAnimated ? { y: "0%", opacity: 1 } : { y: "150%", opacity: 0 }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                HOTEL RAJMAHAL
              </motion.span>
            </span>
            <span className="block overflow-hidden py-1 w-full">
              <motion.span
                initial={{ y: "150%", opacity: 0 }}
                animate={heroAnimated ? { y: "0%", opacity: 1 } : { y: "150%", opacity: 0 }}
                transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D6B892] via-[#D4AF37] to-[#C9A86A] font-serif"
              >
                PALACE
              </motion.span>
            </span>
          </h1>

          <p className="max-w-[270px] sm:max-w-xl text-[11px] sm:text-base text-[#D4AF37] font-serif italic tracking-wide leading-relaxed mb-5 sm:mb-8 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-full bg-[#100F0E]/80 border border-[#D4AF37]/40 backdrop-blur-md shadow-lg">
            &ldquo;Where Heritage Meets Nature&rdquo;
          </p>

          <div className="flex items-center justify-center w-full">
            <Link
              href="/rooms"
              data-cursor="RESERVE"
              className="px-6 sm:px-9 py-3 sm:py-4 bg-gradient-to-r from-[#C9A86A] via-[#D4AF37] to-[#C9A86A] text-[#100F0E] text-[10px] sm:text-xs font-serif uppercase tracking-[0.18em] sm:tracking-[0.25em] font-semibold rounded-sm shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-105 transition-all cursor-pointer inline-block"
            >
              Reserve Your Stay
            </Link>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* SCENE 2 (Frames 90 - 240): RESTAURANT                */}
        {/* Style: Image 4 — Right Floating Dark Card           */}
        {/* ---------------------------------------------------- */}
        <div
          className={`absolute top-20 sm:top-32 right-3 left-3 sm:left-auto sm:right-16 z-20 transition-all duration-700 ${
            frameIndex >= 90 && frameIndex < 240
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-8 pointer-events-none"
          }`}
        >
          <div className="bg-[#181614]/90 backdrop-blur-xl border border-white/10 rounded-[20px] sm:rounded-[28px] p-4.5 sm:p-9 max-w-md sm:max-w-lg shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
            <span className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.35em] text-[#D4AF37] font-semibold mb-1.5 sm:mb-2 block">
              PALACE GASTRONOMY
            </span>
            <h2 className="font-serif text-xl sm:text-5xl text-[#F7F5F2] font-normal leading-tight tracking-wide mb-2 sm:mb-3">
              Dine With a View
            </h2>
            <p className="text-[11px] sm:text-sm text-[#D6B892]/80 leading-relaxed font-light mb-4 sm:mb-6">
              &ldquo;Enjoy delicious moments in a relaxing atmosphere&rdquo;
            </p>
            <Link
              href="/dining"
              data-cursor="DINE"
              className="px-4.5 sm:px-6 py-2.5 sm:py-3 bg-[#D4AF37] hover:bg-amber-300 text-[#100F0E] text-[9.5px] sm:text-[11px] font-serif uppercase tracking-[0.16em] sm:tracking-[0.2em] font-semibold rounded-full shadow-lg hover:scale-105 transition-all cursor-pointer inline-flex items-center gap-1.5 sm:gap-2"
            >
              <span>EXPLORE DINING</span>
              <span className="text-xs">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* SCENE 3 (Frames 240 - 370): BEDROOM                  */}
        {/* Style: Image 1 — Top-Left Floating Dark Card         */}
        {/* ---------------------------------------------------- */}
        <div
          className={`absolute top-20 sm:top-32 left-3 right-3 sm:right-auto sm:left-16 z-20 transition-all duration-700 ${
            frameIndex >= 240 && frameIndex < 370
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-8 pointer-events-none"
          }`}
        >
          <div className="bg-[#181614]/90 backdrop-blur-xl border border-white/10 rounded-[20px] sm:rounded-[28px] p-4.5 sm:p-8 max-w-md sm:max-w-lg shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
            <span className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.35em] text-[#D4AF37] font-semibold mb-1.5 sm:mb-2 block">
              LUXURY ACCOMMODATIONS
            </span>
            <h2 className="font-serif text-xl sm:text-4xl text-[#F7F5F2] font-normal leading-tight tracking-wide mb-2 sm:mb-3">
              Comfortable Rooms
            </h2>
            <p className="text-[11px] sm:text-sm text-[#D6B892]/80 leading-relaxed font-light">
              &ldquo;Relax in thoughtfully designed spaces&rdquo;
            </p>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* SCENE 4 (Frames 370 - 480): BATHROOM                 */}
        {/* Style: Image 3 — Center Heading + 4 Bottom Cards    */}
        {/* ---------------------------------------------------- */}
        <div
          className={`absolute inset-0 z-20 flex flex-col justify-between p-3.5 sm:p-16 transition-all duration-700 ${
            frameIndex >= 370 && frameIndex < 480
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Top Center Title */}
          <div className="text-center max-w-2xl mx-auto pt-16 sm:pt-20">
            <span className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.35em] text-[#D4AF37] font-semibold mb-1 sm:mb-2 block">
              SANCTUARY SPA BATHROOM
            </span>
            <h2 className="font-serif text-2xl sm:text-6xl text-[#F7F5F2] font-normal tracking-wide mb-1 sm:mb-2">
              Modern Comfort
            </h2>
            <p className="text-[11px] sm:text-base text-[#D6B892]/80 italic font-serif">
              &ldquo;Everything you need for a refreshing stay&rdquo;
            </p>
          </div>

          {/* Bottom 4 Feature Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 max-w-5xl mx-auto w-full pb-4 sm:pb-12">
            <div className="bg-[#181614]/90 backdrop-blur-xl border border-white/10 rounded-[14px] sm:rounded-[20px] p-2.5 sm:p-4 text-center shadow-xl">
              <span className="font-serif text-lg sm:text-3xl text-[#F7F5F2] block mb-0.5 sm:mb-1">100%</span>
              <span className="text-[7.5px] min-[360px]:text-[8.5px] sm:text-[9px] uppercase tracking-[0.12em] sm:tracking-[0.2em] text-[#D4AF37] font-semibold block">DARK MARBLE</span>
            </div>
            <div className="bg-[#181614]/90 backdrop-blur-xl border border-white/10 rounded-[14px] sm:rounded-[20px] p-2.5 sm:p-4 text-center shadow-xl">
              <span className="font-serif text-lg sm:text-3xl text-[#F7F5F2] block mb-0.5 sm:mb-1">24/7</span>
              <span className="text-[7.5px] min-[360px]:text-[8.5px] sm:text-[9px] uppercase tracking-[0.12em] sm:tracking-[0.2em] text-[#D4AF37] font-semibold block">ROYAL CONCIERGE</span>
            </div>
            <div className="bg-[#181614]/90 backdrop-blur-xl border border-white/10 rounded-[14px] sm:rounded-[20px] p-2.5 sm:p-4 text-center shadow-xl">
              <span className="font-serif text-lg sm:text-3xl text-[#F7F5F2] block mb-0.5 sm:mb-1">Rain</span>
              <span className="text-[7.5px] min-[360px]:text-[8.5px] sm:text-[9px] uppercase tracking-[0.12em] sm:tracking-[0.2em] text-[#D4AF37] font-semibold block">THERAPEUTIC SHOWER</span>
            </div>
            <div className="bg-[#181614]/90 backdrop-blur-xl border border-white/10 rounded-[14px] sm:rounded-[20px] p-2.5 sm:p-4 text-center shadow-xl">
              <span className="font-serif text-lg sm:text-3xl text-[#F7F5F2] block mb-0.5 sm:mb-1">Luxury</span>
              <span className="text-[7.5px] min-[360px]:text-[8.5px] sm:text-[9px] uppercase tracking-[0.12em] sm:tracking-[0.2em] text-[#D4AF37] font-semibold block">PALACE AMENITIES</span>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* SCENE 5 (Frames 480 - 585): BEDROOM (RETURN)         */}
        {/* Style: Image 2 — Bottom-Left Floating Dark Card     */}
        {/* ---------------------------------------------------- */}
        <div
          className={`absolute bottom-6 sm:bottom-20 left-3 right-3 sm:right-auto sm:left-16 z-20 transition-all duration-700 ${
            frameIndex >= 480 && frameIndex < 585
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-8 pointer-events-none"
          }`}
        >
          <div className="bg-[#181614]/90 backdrop-blur-xl border border-white/10 rounded-[20px] sm:rounded-[28px] p-4.5 sm:p-9 max-w-md sm:max-w-lg shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
            <span className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.35em] text-[#D4AF37] font-semibold mb-1.5 sm:mb-2 block">
              PRIVATE RETREAT
            </span>
            <h2 className="font-serif text-xl sm:text-5xl text-[#F7F5F2] font-normal leading-tight tracking-wide mb-2 sm:mb-3">
              Your Private Retreat
            </h2>
            <p className="text-[11px] sm:text-sm text-[#D6B892]/80 leading-relaxed font-light mb-4 sm:mb-6">
              &ldquo;Comfort, warmth and peaceful surroundings&rdquo;
            </p>
            <button
              onClick={onOpenSuites}
              data-cursor="ROOMS"
              className="px-4.5 sm:px-6 py-2.5 sm:py-3 bg-[#D4AF37] hover:bg-amber-300 text-[#100F0E] text-[9.5px] sm:text-[11px] font-serif uppercase tracking-[0.16em] sm:tracking-[0.2em] font-semibold rounded-full shadow-lg hover:scale-105 transition-all cursor-pointer inline-flex items-center gap-1.5 sm:gap-2"
            >
              <span>EXPLORE SUITES</span>
              <span className="text-xs">&rarr;</span>
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* SCENE 6 (Frames 585 - 650): BALCONY (VALLEY VIEWS)   */}
        {/* Style: Image 1 — Top-Left Floating Dark Card         */}
        {/* ---------------------------------------------------- */}
        <div
          className={`absolute top-20 sm:top-32 left-3 right-3 sm:right-auto sm:left-16 z-20 transition-all duration-700 ${
            frameIndex >= 585 && frameIndex < 650
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-8 pointer-events-none"
          }`}
        >
          <div className="bg-[#181614]/90 backdrop-blur-xl border border-white/10 rounded-[20px] sm:rounded-[28px] p-4.5 sm:p-8 max-w-md sm:max-w-lg shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
            <span className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.35em] text-[#D4AF37] font-semibold mb-1.5 sm:mb-2 block">
              PANORAMIC VALLEYS
            </span>
            <h2 className="font-serif text-xl sm:text-4xl text-[#F7F5F2] font-normal leading-tight tracking-wide mb-2 sm:mb-3">
              Views to Remember
            </h2>
            <p className="text-[11px] sm:text-sm text-[#D6B892]/80 leading-relaxed font-light">
              &ldquo;Wake up to peaceful valley views&rdquo;
            </p>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* SCENE 7 (Frames 650 - 720): BALCONY (CLOSING MOMENT) */}
        {/* Style: Centered Regal Card                           */}
        {/* ---------------------------------------------------- */}
        <div
          className={`absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-3 sm:px-6 transition-all duration-700 ${
            frameIndex >= 650 && frameIndex <= 720
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="bg-[#181614]/90 backdrop-blur-xl border border-white/10 rounded-[20px] sm:rounded-[28px] p-6 sm:p-12 max-w-xl sm:max-w-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] flex flex-col items-center">
            <span className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.35em] text-[#D4AF37] font-semibold mb-1.5 sm:mb-2 block">
              ROYAL HILL SANCTUARY
            </span>
            <h2 className="font-serif text-2xl sm:text-6xl text-[#F7F5F2] font-normal tracking-wide mb-2 sm:mb-3">
              Stay. Relax. Breathe.
            </h2>
            <p className="text-[11px] sm:text-base text-[#D6B892]/80 font-serif italic mb-5 sm:mb-6">
              &ldquo;End your day surrounded by nature&rdquo;
            </p>
            <button
              onClick={onOpenBooking}
              data-cursor="RESERVE"
              className="px-6 sm:px-8 py-3 sm:py-3.5 bg-[#D4AF37] hover:bg-amber-300 text-[#100F0E] text-[9.5px] sm:text-[11px] font-serif uppercase tracking-[0.16em] sm:tracking-[0.2em] font-semibold rounded-full shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-105 transition-all cursor-pointer inline-flex items-center gap-1.5 sm:gap-2"
            >
              <span>RESERVE YOUR STAY</span>
              <span className="text-xs">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

