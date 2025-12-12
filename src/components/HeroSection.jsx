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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        
        {/* LEFT SIDE: MAIN CAROUSEL */}
        <div className="lg:col-span-3 relative group overflow-hidden rounded-2xl bg-[#1a1c20]">
          
          {/* Responsive height container */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[21/10] lg:min-h-[500px]">
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
                {/* Responsive Image */}
                <Image
                  src={slides[current].image}
                  alt={slides[current].title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 75vw, 66vw"
                  className="object-contain sm:object-cover object-center"
                  priority
                  quality={90}
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons - Hidden on Mobile */}
            <button 
              onClick={prevSlide}
              className="hidden sm:flex absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-orange-500 text-white p-2 lg:p-3 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 items-center justify-center"
            >
              <ChevronLeft size={20} className="lg:w-6 lg:h-6" />
            </button>
            <button 
              onClick={nextSlide}
              className="hidden sm:flex absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-orange-500 text-white p-2 lg:p-3 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 items-center justify-center"
            >
              <ChevronRight size={20} className="lg:w-6 lg:h-6" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-3 sm:bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 sm:gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > current ? 1 : -1);
                    setCurrent(index);
                  }}
                  className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
                    index === current 
                      ? "w-6 sm:w-8 bg-orange-500" 
                      : "w-1.5 sm:w-2 bg-gray-500/50 hover:bg-white"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: STATIC BANNERS */}
        <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
          
          {/* Banner 1: KS3 */}
          <div className="relative group rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-square lg:aspect-auto lg:flex-1 lg:min-h-[242px]">
            <Image
              src="/images/ks3.webp"
              alt="KS3 Gadget"
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              quality={85}
            />
          </div>

          {/* Banner 2: Watch */}
          <div className="relative group rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-square lg:aspect-auto lg:flex-1 lg:min-h-[242px]">
            <Image
              src="/images/watch.jpeg"
              alt="Premium Watch"
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              quality={85}
            />
          </div>

        </div>

      </div>
    </section>
  );
}