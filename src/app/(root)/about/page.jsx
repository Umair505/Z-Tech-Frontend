'use client';
import { motion } from 'framer-motion';
import { Target, Users, Zap, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  const features = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To empower tech enthusiasts with the latest innovations, making cutting-edge gadgets accessible to everyone in Bangladesh."
    },
    {
      icon: Users,
      title: "Community First",
      description: "Building a vibrant community where technology lovers can connect, share experiences, and stay updated with the digital world."
    },
    {
      icon: Zap,
      title: "Innovation Hub",
      description: "Curating only the most innovative and high-performance gadgets that redefine how you live, work, and play."
    },
    {
      icon: ShieldCheck,
      title: "Trusted Quality",
      description: "Guaranteed authentic products with official warranties, ensuring peace of mind with every purchase you make."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      
      {/* Hero Section */}
      <section className="relative py-24 bg-[#0f1012] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-orange-600/30 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
          >
            Redefining <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Technology</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Z-TECH is more than just a store; it's a gateway to the future. We bring the world's most advanced gadgets to your doorstep.
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                    <img 
                        src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
                        alt="Our Story" 
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-8 left-8 text-white">
                        <p className="text-sm font-bold uppercase tracking-widest text-orange-500 mb-2">Since 2024</p>
                        <h3 className="text-3xl font-bold">The Journey Begins</h3>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <h2 className="text-4xl font-bold text-gray-900">Who We Are</h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        At Z-TECH, we believe that technology should be an extension of your potential. Founded by a team of passionate tech enthusiasts, we started with a simple goal: to eliminate the gap between global innovation and local accessibility.
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        From the latest audio gear to smart wearables and futuristic drones, our catalog is curated with precision. We don't just sell products; we sell experiences that upgrade your lifestyle.
                    </p>
                    <div className="pt-4">
                        <div className="flex gap-8">
                            <div>
                                <h4 className="text-4xl font-bold text-orange-600">15K+</h4>
                                <p className="text-gray-500 font-medium">Happy Customers</p>
                            </div>
                            <div>
                                <h4 className="text-4xl font-bold text-orange-600">500+</h4>
                                <p className="text-gray-500 font-medium">Premium Products</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Z-TECH?</h2>
                <p className="text-gray-500 max-w-2xl mx-auto">We are committed to excellence in every aspect of your shopping experience.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, idx) => (
                    <motion.div 
                        key={idx}
                        whileHover={{ y: -10 }}
                        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
                    >
                        <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6 text-orange-600">
                            <feature.icon size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                        <p className="text-gray-500 leading-relaxed">{feature.description}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

    </div>
  );
}