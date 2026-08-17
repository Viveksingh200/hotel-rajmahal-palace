"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import InteractiveHotspot from "./InteractiveHotspot";
import { ChevronRight, Crown } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// 240 Continuous Frames with /images/hero.png as the first frame
const FRAME_URLS = [
  "/images/hero.jpeg",
  ...Array.from(
    { length: 239 },
    (_, i) => `/frames/ezgif-frame-${String(i + 2).padStart(3, "0")}.jpg`
  )
];
const TOTAL_FRAMES = FRAME_URLS.length; // 240 frames

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

  // Mask reveal animation trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroAnimated(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Preload native Hotel Rajmahal Palace frames
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages = new Array(TOTAL_FRAMES);

    let currentIndex = 0;
    const BATCH_SIZE = 20;

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

          const prog = (loadedCount / TOTAL_FRAMES) * 100;
          if (onProgress) onProgress(prog);

          if (loadedCount >= TOTAL_FRAMES) {
            setImagesLoaded(true);
            if (onReady) onReady();
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
  }, [onProgress, onReady]);

  // Instant High-Precision Canvas Drawing Engine
  const renderFrame = (idx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let img = imagesRef.current[idx];

    // Fallback to nearest loaded frame if target frame is downloading
    if (!img || !img.complete) {
      for (let offset = 1; offset < 30; offset++) {
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

  // Direct 1:1 Hardware Sync ScrollTrigger (Instant stop when finger is removed)
  useEffect(() => {
    if (!imagesLoaded || !containerRef.current) return;

    let lastFrame = -1;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true, // Instant 1:1 hardware touch/scroll tracking - zero trailing drift!
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

    return () => {
      trigger.kill();
    };
  }, [imagesLoaded]);

  return (
    <div ref={containerRef} className="relative w-full h-[600vh] bg-[#100F0E]">
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
        {/* SCENE 1 (Frames 0 - 45): HERO ARRIVAL               */}
        {/* ---------------------------------------------------- */}
        <div
          className={`absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 transition-all duration-500 ${
            frameIndex >= 0 && frameIndex < 45
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <h1 className="font-serif text-4xl sm:text-7xl lg:text-9xl text-[#F7F5F2] tracking-[0.05em] font-normal uppercase leading-[0.95] drop-shadow-2xl mb-6 flex flex-col items-center select-none">
            <span className="block overflow-hidden py-1">
              <motion.span
                initial={{ y: "150%", opacity: 0 }}
                animate={heroAnimated ? { y: "0%", opacity: 1 } : { y: "150%", opacity: 0 }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                HOTEL RAJMAHAL
              </motion.span>
            </span>
            <span className="block overflow-hidden py-1">
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

          <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#100F0E]/70 border border-[#D4AF37]/40 mb-4 text-[#D4AF37] backdrop-blur-md">
            &ldquo;Surrounded by misty green hills, warm red sandstone, and timeless Indian grandeur.&rdquo;
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenBooking}
              className="px-9 py-4 bg-gradient-to-r from-[#C9A86A] via-[#D4AF37] to-[#C9A86A] text-[#100F0E] text-xs font-serif uppercase tracking-[0.25em] font-semibold rounded-sm shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-105 transition-all cursor-pointer"
            >
              Reserve Your Stay
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* SCENE 2 (Frames 45 - 90): GRAND SANDSTONE ENTRANCE   */}
        {/* ---------------------------------------------------- */}
        <div
          className={`absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 transition-all duration-500 ${
            frameIndex >= 45 && frameIndex < 90
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-8 pointer-events-none"
          }`}
        >
          <h2 className="font-serif text-3xl sm:text-6xl lg:text-7xl text-[#F7F5F2] tracking-wide font-normal max-w-4xl leading-tight">
            Warm Red Sandstone & Dark Charcoal Marble
          </h2>
          <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#100F0E]/70 border border-[#D4AF37]/40 mb-4 text-[#D4AF37] backdrop-blur-md tracking-[.1em]">
            Centuries of Indian craftsmanship preserved in pure hillside tranquility.
          </p>
        </div>

        {/* ---------------------------------------------------- */}
        {/* SCENE 3 (Frames 90 - 135): LOBBY & INTERACTIVE PINS  */}
        {/* ---------------------------------------------------- */}
        <div
          className={`absolute inset-0 z-20 transition-all duration-500 ${
            frameIndex >= 90 && frameIndex < 135
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="absolute top-28 left-8 lg:left-16 max-w-md bg-[#100F0E]/85 backdrop-blur-xl border border-[#D4AF37]/30 p-6 rounded-lg shadow-2xl">
            <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase">
              ARTISANAL ARCHITECTURE
            </span>
            <h3 className="font-serif text-2xl text-[#F7F5F2] mt-1 mb-2">
              Uncompromising Texture & Tone
            </h3>
            <p className="text-xs text-[#D6B892]/80 font-sans leading-relaxed">
              Carved from rare Rajasthani sandstone, solid teakwood joinery, and hand-polished charcoal marble floors.
            </p>
          </div>

          <InteractiveHotspot
            top="42%"
            left="32%"
            title="Dark Grey Marble Floor"
            subtitle="Extracted from ancient quarries, hand-polished for deep cooling luster"
            tag="ROYAL MARBLE"
            onClick={onOpenSuites}
          />
          <InteractiveHotspot
            top="58%"
            left="68%"
            title="Teakwood Jharokha Balconies"
            subtitle="Traditional carved overhangs offering cool mountain breezes"
            tag="HERITAGE CRAFT"
            onClick={onOpenSuites}
          />
        </div>

        {/* ---------------------------------------------------- */}
        {/* SCENE 4 (Frames 135 - 180): ROYAL SUITES & ROOMS      */}
        {/* ---------------------------------------------------- */}
        <div
          className={`absolute inset-0 z-20 flex flex-col justify-end p-8 lg:p-16 transition-all duration-500 ${
            frameIndex >= 135 && frameIndex < 180
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-8 pointer-events-none"
          }`}
        >
          <div className="max-w-2xl bg-[#100F0E]/90 backdrop-blur-2xl border border-[#D4AF37]/35 p-8 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#D4AF37] uppercase">
              HERITAGE ROYAL CHAMBERS
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#F7F5F2] my-2">
              Wake Up Beside Rolling Green Hills.
            </h2>
            <p className="text-xs sm:text-sm text-[#D6B892]/80 font-sans mb-6 leading-relaxed">
              Four-poster handcrafted teak beds, organic silk throws, and step-out private terraces overlooking mountain mist.
            </p>
            <button
              onClick={onOpenSuites}
              className="flex items-center gap-3 px-7 py-3.5 bg-[#D4AF37] text-[#100F0E] text-xs font-serif uppercase tracking-[0.2em] font-semibold rounded-sm hover:bg-[#C9A86A] transition-colors cursor-pointer"
            >
              <span>Explore Royal Rooms</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* SCENE 5 (Frames 180 - 210): MARBLE BATH & STATS      */}
        {/* ---------------------------------------------------- */}
        <div
          className={`absolute inset-0 z-20 flex flex-col items-center justify-center p-6 transition-all duration-500 ${
            frameIndex >= 180 && frameIndex < 210
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div className="text-center mb-8">
            <span className="text-xs font-mono tracking-[0.3em] text-[#D4AF37] uppercase">
              CHARCOAL MARBLE BATH CHAMBERS
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl text-[#F7F5F2] font-normal">
              Opulent Marble & Rain Showers
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl w-full">
            <div className="p-5 rounded-md bg-[#100F0E]/90 backdrop-blur-xl border border-[#D4AF37]/30 text-center">
              <span className="font-serif text-3xl sm:text-4xl text-[#D4AF37]">100%</span>
              <p className="text-[10px] font-mono tracking-widest text-[#D6B892]/70 uppercase mt-1">Dark Grey Marble</p>
            </div>
            <div className="p-5 rounded-md bg-[#100F0E]/90 backdrop-blur-xl border border-[#D4AF37]/30 text-center">
              <span className="font-serif text-3xl sm:text-4xl text-[#D4AF37]">24/7</span>
              <p className="text-[10px] font-mono tracking-widest text-[#D6B892]/70 uppercase mt-1">Royal Butler</p>
            </div>
            <div className="p-5 rounded-md bg-[#100F0E]/90 backdrop-blur-xl border border-[#D4AF37]/30 text-center">
              <span className="font-serif text-3xl sm:text-4xl text-[#D4AF37]">1,250</span>
              <p className="text-[10px] font-mono tracking-widest text-[#D6B892]/70 uppercase mt-1">Sq Ft Presidential</p>
            </div>
            <div className="p-5 rounded-md bg-[#100F0E]/90 backdrop-blur-xl border border-[#D4AF37]/30 text-center">
              <span className="font-serif text-3xl sm:text-4xl text-[#D4AF37]">Dual</span>
              <p className="text-[10px] font-mono tracking-widest text-[#D6B892]/70 uppercase mt-1">Rain Bath Vanities</p>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* SCENE 6 (Frames 210 - 240): FINAL CALL TO STAY        */}
        {/* ---------------------------------------------------- */}
        <div
          className={`absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 transition-all duration-500 ${
            frameIndex >= 210 && frameIndex < 240
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <h2 className="font-serif text-5xl sm:text-8xl text-[#F7F5F2] font-normal">
            Hotel Rajmahal Palace
          </h2>
          <p className="text-xs sm:text-lg text-[#D4AF37] max-w-xl font-serif font-bold italic mt-4 mb-8 gap-2 px-4 py-1.5 rounded-full bg-[#100F0E]/70 border border-[#D4AF37]/40 tracking-wider">
            &ldquo;Step into warm royal hospitality, dark marble comfort, and serene balcony hill views.&rdquo;
          </p>
          <button
            onClick={onOpenBooking}
            className="px-10 py-4 bg-gradient-to-r from-[#C9A86A] via-[#D4AF37] to-[#C9A86A] text-[#100F0E] text-xs font-serif uppercase tracking-[0.25em] font-semibold rounded-sm shadow-[0_0_40px_rgba(212,175,55,0.6)] hover:scale-105 transition-all cursor-pointer"
          >
            Reserve Your Royal Stay
          </button>
        </div>
      </div>
    </div>
  );
}
