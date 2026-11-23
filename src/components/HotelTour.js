"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Maximize, RefreshCw, Volume2, VolumeX, Eye } from "lucide-react";
import { VISUAL_TOUR_STAGES } from "@/data/hotel";
import { motion } from "framer-motion";

const EXCLUDED_RANGES = [
  [200, 240],
  [410, 480],
  [676, 720],
];

const FRAME_URLS = [];
for (let num = 1; num <= 720; num++) {
  const isExcluded = EXCLUDED_RANGES.some(([start, end]) => num >= start && num <= end);
  if (!isExcluded) {
    FRAME_URLS.push(`/frames/ezgif-frame-${String(num).padStart(3, "0")}.jpg`);
  }
}

const TOTAL_FRAMES = FRAME_URLS.length;

export default function HotelTour() {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const animFrameRef = useRef(null);
  const containerRef = useRef(null);

  const matchedStage = VISUAL_TOUR_STAGES.find(
    (stage) => currentFrameIndex >= stage.frameStart && currentFrameIndex <= stage.frameEnd
  );
  const activeStageId = matchedStage ? matchedStage.id : "exterior";

  // Preload frames for smooth canvas rendering
  useEffect(() => {
    let loadedCount = 0;
    const images = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = FRAME_URLS[i];

      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.floor((loadedCount / TOTAL_FRAMES) * 100));
        if (loadedCount === TOTAL_FRAMES) {
          setImagesLoaded(true);
        }
      };

      images.push(img);
    }

    imagesRef.current = images;

    return () => {
      imagesRef.current = [];
    };
  }, []);

  // Render frame on Canvas
  const drawFrame = (frameNum) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[frameNum - 1];
    if (img && img.complete) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  };

  // Animation Loop
  useEffect(() => {
    let lastTime = performance.now();
    const frameInterval = 80; // ~12 fps smooth cinematic panning speed

    const animate = (time) => {
      if (isPlaying) {
        if (time - lastTime > frameInterval) {
          setCurrentFrameIndex((prevIndex) => {
            const nextIndex = prevIndex >= TOTAL_FRAMES ? 1 : prevIndex + 1;
            drawFrame(nextIndex);
            return nextIndex;
          });
          lastTime = time;
        }
      }
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  // Draw frame when frame index changes manually
  useEffect(() => {
    drawFrame(currentFrameIndex);
  }, [currentFrameIndex]);

  const jumpToStage = (stage) => {
    setCurrentFrameIndex(stage.frameStart);
    setActiveStageId(stage.id);
    drawFrame(stage.frameStart);
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch((err) => console.log(err));
      } else {
        document.exitFullscreen();
      }
    }
  };

  const activeStage = VISUAL_TOUR_STAGES.find((s) => s.id === activeStageId) || VISUAL_TOUR_STAGES[0];

  return (
    <section id="hotel-tour" className="py-20 bg-charcoal text-cream relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sandstone/15 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.4em] text-gold font-medium block mb-2">
            VIRTUAL HOTEL EXPERIENCE
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-white mb-4 tracking-tight">
            STEP INSIDE
          </h2>
          <div className="w-24 h-0.5 mx-auto bg-gold/60 mb-6" />
          <p className="text-base sm:text-lg font-serif italic text-cream/80 leading-relaxed">
            &ldquo;Take a closer look at the spaces, comfort and views that make Hotel Rajmahal Palace special.&rdquo;
          </p>
        </div>

        {/* Stage Selector Navigation */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
          {VISUAL_TOUR_STAGES.map((stage) => {
            const isActive = stage.id === activeStageId;
            return (
              <button
                key={stage.id}
                onClick={() => jumpToStage(stage)}
                className={`px-4 py-2 rounded-full text-xs font-serif tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 ${
                  isActive
                    ? "bg-gradient-to-r from-[#C9A86A] via-[#D4AF37] to-[#C9A86A] text-[#100F0E] font-bold border border-gold shadow-lg shadow-gold/30 scale-105"
                    : "bg-charcoal-light text-cream/70 hover:text-white border border-white/10 hover:border-gold/40"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-[#100F0E]" : "bg-white/30"}`} />
                {stage.name}
              </button>
            );
          })}
        </div>

        {/* Video / Canvas Player Container */}
        <div ref={containerRef} className="relative rounded-lg overflow-hidden border border-sandstone/30 shadow-2xl bg-black aspect-video max-w-5xl mx-auto group">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover block"
          />

          {/* Video Overlay Info */}
          <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent p-4 sm:p-6 flex items-center justify-between z-10">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold block">
                VIRTUAL EXPERIENCE
              </span>
              <h3 className="text-lg sm:text-xl font-serif text-white tracking-wide">
                {activeStage.name}
              </h3>
            </div>
            <span className="text-xs bg-black/60 backdrop-blur-md px-3 py-1 rounded border border-gold/30 text-gold font-serif">
              {activeStage.highlight}
            </span>
          </div>

          {/* Loading Overlay */}
          {!imagesLoaded && (
            <div className="absolute inset-0 bg-charcoal/90 flex flex-col items-center justify-center z-20">
              <RefreshCw className="w-8 h-8 text-gold animate-spin mb-3" />
              <p className="text-xs uppercase tracking-widest text-cream">
                Preparing Tour Experience ({loadProgress}%)
              </p>
            </div>
          )}

          {/* Tour Controls Bar */}
          <div className="absolute bottom-0 inset-x-0 z-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 sm:p-6 flex flex-col gap-3 opacity-90 group-hover:opacity-100 transition-opacity">
            {/* Timeline Bar */}
            <div className="w-full bg-white/20 h-1.5 rounded-full cursor-pointer relative overflow-hidden">
              <div
                className="bg-gold h-full transition-all duration-100"
                style={{ width: `${(currentFrameIndex / TOTAL_FRAMES) * 100}%` }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2.5 rounded-full bg-gradient-to-r from-[#C9A86A] via-[#D4AF37] to-[#C9A86A] text-[#100F0E] border border-gold/40 transition-transform hover:scale-105 focus:outline-none"
                  aria-label={isPlaying ? "Pause tour" : "Play tour"}
                >
                  {isPlaying ? <Pause className="w-4 h-4 text-[#100F0E]" /> : <Play className="w-4 h-4 fill-[#100F0E] text-[#100F0E]" />}
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 text-cream/80 hover:text-gold transition-colors focus:outline-none"
                  aria-label={isMuted ? "Unmute sound" : "Mute sound"}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-gold" />}
                </button>

                <span className="text-xs tracking-wider text-cream/70 font-mono hidden sm:inline-block">
                  Stage: {activeStage.name} ({currentFrameIndex}/{TOTAL_FRAMES})
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={toggleFullscreen}
                  className="p-2 text-cream/80 hover:text-gold transition-colors focus:outline-none"
                  aria-label="Fullscreen"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
