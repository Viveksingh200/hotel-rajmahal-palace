"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Trees, Compass, HeartHandshake, CloudSun } from "lucide-react";

export default function ExperienceSection() {
  const experiences = [
    {
      icon: <CloudSun className="w-6 h-6 text-gold" />,
      title: "Scenic Hill Surroundings",
      description: "Surrounded by ancient mist-clad hills, offering pure mountain air and panoramic greenery.",
    },
    {
      icon: <Trees className="w-6 h-6 text-gold" />,
      title: "Lush Green Landscapes",
      description: "Manicured palace gardens and terraced lawns designed for serene morning walks.",
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-gold" />,
      title: "Peaceful Nature Escape",
      description: "Far removed from city bustle, enjoy quiet evenings filled with birdsong and twilight breezes.",
    },
    {
      icon: <Compass className="w-6 h-6 text-gold" />,
      title: "Private Balcony Lounges",
      description: "Every suite terrace provides direct vistas of the distant, peaceful hill landscape.",
    },
  ];

  return (
    <section id="experience" className="py-24 bg-cream text-charcoal relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sandstone/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.4em] text-sandstone font-semibold block mb-2">
            NATURE & SERENITY
          </span>
          <h2 className="text-2xl sm:text-5xl font-serif text-charcoal tracking-tight mb-3 sm:mb-4">
            Peace & Nature in the Hills
          </h2>
          <div className="w-16 sm:w-24 h-0.5 mx-auto bg-gold mb-4 sm:mb-6" />
          <p className="text-sm sm:text-lg font-serif italic text-sandstone">
            &ldquo;Relax and enjoy nature surrounded by fresh mountain air and peaceful green hills.&rdquo;
          </p>
        </div>

        {/* Large Feature Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative h-[400px] sm:h-[500px] rounded-xl overflow-hidden shadow-2xl border border-sandstone/20 mb-16"
        >
          <Image
            src="/images/temple.webp"
            alt="Sacred Bhimashankar Jyotirlinga Temple near Hotel Rajmahal Palace"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
          <div className="absolute bottom-6 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8 max-w-2xl">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-gold font-medium block mb-1.5 sm:mb-2">
              SACRED JYOTIRLINGA
            </span>
            <h3 className="text-xl sm:text-4xl font-serif text-white mb-1.5 sm:mb-2">
              Bhimashankar Temple
            </h3>
            <p className="text-sm sm:text-base text-cream/90 font-light">
              Stay close to the ancient Bhimashankar Jyotirlinga temple, surrounded by peaceful Sahyadri hills and lush green nature.
            </p>
          </div>
        </motion.div>

        {/* 4 Feature Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {experiences.map((exp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-lg border border-sandstone/15 hover:border-gold/60 shadow-lg hover:shadow-xl transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-sandstone/10 border border-gold/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {exp.icon}
              </div>
              <h4 className="text-xl font-serif text-charcoal mb-2">{exp.title}</h4>
              <p className="text-xs text-charcoal/70 leading-relaxed font-sans">{exp.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
