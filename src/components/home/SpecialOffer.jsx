'use client';

import Image from "next/image";
import { motion } from 'framer-motion';
import { ArrowRight, Tag } from 'lucide-react';

export default function SpecialOffer() {
  return (
    <section className="relative w-full py-24 overflow-hidden bg-[#0f1012]">

      {/* Background covering entire section */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/bg.png"
          alt="Special Offer Background"
          fill
          className="object-cover"
          priority
          quality={100}
          sizes="100vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
        {/* Optional: Add a very subtle overlay if needed for text readability */}
        {/* <div className="absolute inset-0 bg-black/5"></div> */}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">

          {/* LEFT CONTENT */}
          <div className="w-full md:w-1/2 space-y-6">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-orange-500 font-bold uppercase tracking-widest text-sm"
            >
              <Tag size={18} />
              <span>Limited Time Deal</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-extrabold text-white leading-tight"
            >
              Experience Virtual <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                Reality Pro
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-200 text-lg max-w-lg leading-relaxed font-medium"
            >
              Immerse yourself in a new world with our latest VR technology.
              Crystal clear resolution, 3D spatial audio, and ultra-low latency.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="pt-4 flex items-center gap-6"
            >
              <div>
                <p className="text-sm text-gray-300 line-through">৳45,000</p>
                <p className="text-3xl font-bold text-white">৳32,999</p>
              </div>

              <a
                href="/products"
                className="group flex items-center gap-2 px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-full font-bold transition-all shadow-lg shadow-orange-600/30"
              >
                Shop Now
                <ArrowRight
                  size={20}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
            </motion.div>

          </div>

          {/* RIGHT PRODUCT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="w-full md:w-1/2 flex justify-center relative"
          >
            {/* Glow Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/30 rounded-full blur-[100px] animate-pulse" />

            {/* Floating Image */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10"
            >
              <div className="relative w-[350px] h-[350px]">
                <Image
                  src="/images/vr1.png"
                  alt="VR Headset"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>

    </section>
  );
}