"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const STORY_SECTIONS = [
  {
    id: "welcome",
    number: "01",
    tagline: "WELCOME",
    heading: "Arrive somewhere extraordinary.",
    description:
      "Perched gracefully amidst rolling hills and lush greens, Hotel Rajmahal Palace offers an oasis of calm. Experience authentic Indian heritage architecture, warm sandstone walls, and breathtaking valley vistas.",
    image: "/images/hero-exterior.jpg",
    imageAlt: "Hotel Rajmahal Palace Exterior Facade & Green Hills",
    reverse: false,
  },
  {
    id: "step-inside",
    number: "02",
    tagline: "STEP INSIDE",
    heading: "Warm hospitality begins at the door.",
    description:
      "Step past handcrafted wooden doors into a sunlit courtyard entrance. The air carries the delicate scent of fresh flowers, and every corner reflects centuries-old royal hospitality.",
    image: "/images/entrance.jpg",
    imageAlt: "Red Sandstone Entrance with Wooden Doors",
    reverse: true,
  },
  {
    id: "rest",
    number: "03",
    tagline: "REST",
    heading: "Comfort designed for peaceful stays.",
    description:
      "Retire to heritage bedroom suites adorned with solid teak wood furniture, crisp hand-loomed linens, dark marble flooring, and warm ambient lighting tailored for effortless rest.",
    image: "/images/bedroom.jpg",
    imageAlt: "Heritage Bedroom with Teak Wood Bed",
    reverse: false,
  },
  {
    id: "refresh",
    number: "04",
    tagline: "REFRESH",
    heading: "Simple, comfortable spaces for a relaxing stay.",
    description:
      "Indulge in spacious en-suite bathrooms finished in polished dark charcoal grey marble. Features dual rain showerheads, brass fixtures, and natural sunlight pouring through private frosted windows.",
    image: "/images/bathroom.jpg",
    imageAlt: "Dark Charcoal Grey Marble Bathroom",
    reverse: true,
  },
  {
    id: "the-view",
    number: "05",
    tagline: "THE VIEW",
    heading: "Wake up to the hills.",
    description:
      "Step onto your private balcony terrace featuring white decorative railings and teak seating. Breathe in the crisp morning mountain air as golden sunlight illuminates the distant hills.",
    image: "/images/balcony.jpg",
    imageAlt: "Private Balcony with White Railing overlooking Hills",
    reverse: false,
  },
  {
    id: "dine",
    number: "06",
    tagline: "DINE",
    heading: "Gather, relax and enjoy.",
    description:
      "Immerse yourself in relaxed dining amidst dark green seating, white metal accent chairs, marble tables, and glowing chandeliers serving fresh regional recipes and continental delicacies.",
    image: "/images/restaurant.jpg",
    imageAlt: "Palace Courtyard Dining Room",
    reverse: true,
  },
];

export default function ScrollStory() {
  return (
    <section className="py-24 bg-cream text-charcoal relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28">
        {STORY_SECTIONS.map((section) => (
          <div
            key={section.id}
            id={section.id}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center ${
              section.reverse ? "lg:flex-row-reverse" : ""
            }`}
          >
            {/* Image Column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={`lg:col-span-7 relative h-[400px] sm:h-[500px] rounded-lg overflow-hidden shadow-2xl border border-gold/20 ${
                section.reverse ? "lg:order-2" : "lg:order-1"
              }`}
            >
              <Image
                src={section.image}
                alt={section.imageAlt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-4 left-4 bg-charcoal/80 backdrop-blur-md px-3.5 py-1.5 rounded-sm border border-gold/30">
                <span className="text-xs font-serif text-gold tracking-widest">{section.number}</span>
              </div>
            </motion.div>

            {/* Content Column */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`lg:col-span-5 flex flex-col justify-center ${
                section.reverse ? "lg:order-1" : "lg:order-2"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="h-px w-8 bg-gold" />
                <span className="text-xs uppercase tracking-[0.35em] text-sandstone font-semibold">
                  {section.tagline}
                </span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-serif text-charcoal mb-6 leading-tight">
                {section.heading}
              </h3>

              <p className="text-base text-charcoal/80 leading-relaxed font-sans font-normal mb-8">
                {section.description}
              </p>

              <div className="w-16 h-0.5 bg-gold/40" />
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
