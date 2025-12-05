"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, ArrowRight, Zap } from "lucide-react";

// Carousel Data Configuration
const slides = [
  {
    id: 1,
    image: "/images/carousel/ipad-air-m3.webp",
    title: "iPad Air M3",
    subtitle: "Supercharged performance. Infinite possibilities.",
    tag: "New Arrival",
    bgAccent: "from-blue-600/20"
  },
  {
    id: 2,
    image: "/images/carousel/oneplussBullets.webp",
    title: "OnePlus Bullets Z2",
    subtitle: "10 Minutes Charge, 20 Hours Music.",
    tag: "Best Seller",
    bgAccent: "from-red-600/20"
  },
  {
    id: 3,
    image: "/images/carousel/smartBand.webp",
    title: "Next Gen Smart Band",
    subtitle: "Track your fitness with precision.",
    tag: "Trending",
    bgAccent: "from-orange-600/20"
  },
  {
    id: 4,
    image: "/images/carousel/wirelessHeadphone.webp",
    title: "Premium Wireless Audio",
    subtitle: "Immersive sound with active noise cancellation.",
    tag: "Hot Deal",
    bgAccent: "from-purple-600/20"
  },
  {
    id: 5,
    image: "/images/carousel/apple.png",
    title: "Apple Ecosystem",
    subtitle: "Seamlessly connect your devices.",
    tag: "Featured",
    bgAccent: "from-gray-600/20"
  }
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [current]);

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const slideVariants = {
    hidden: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "circOut" },
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      transition: { duration: 0.5, ease: "circIn" },
    }),
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-auto lg:h-[500px]">
        
        {/* LEFT SIDE: MAIN CAROUSEL */}
        <div className="lg:col-span-3 relative group overflow-hidden rounded-2xl border border-gray-800 bg-[#1a1c20]">
          
          <div className="relative w-full h-[400px] lg:h-full">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={slides[current].id}
                custom={direction}
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute inset-0 w-full h-full"
              >
                {/* Clean Image Only - No Overlays */}
                <Image
                  src={slides[current].image}
                  alt={slides[current].title}
                  fill
                  className="object-cover object-center"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-orange-500 text-white p-3 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-orange-500 text-white p-3 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <ChevronRight size={24} />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > current ? 1 : -1);
                    setCurrent(index);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === current ? "w-8 bg-orange-500" : "w-2 bg-gray-500/50 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: STATIC BANNERS - Clean Images Only */}
        <div className="lg:col-span-1 flex flex-col gap-6 h-[400px] lg:h-full">
          
          {/* Banner 1: KS3 - Image Only */}
          <div className="relative flex-1 group rounded-2xl overflow-hidden border border-gray-800">
            <Image
              src="/images/ks3.webp"
              alt="KS3 Gadget"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>

          {/* Banner 2: Watch - Image Only */}
          <div className="relative flex-1 group rounded-2xl overflow-hidden border border-gray-800">
            <Image
              src="/images/watch.jpeg"
              alt="Premium Watch"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>

        </div>

      </div>
    </section>
  );
}