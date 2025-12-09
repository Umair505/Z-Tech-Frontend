'use client';
import { ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/cards/ProductCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// FIX: Added default empty array
export default function FeaturedProducts({ products = [] }) {
  // FIX: Added safety check
  const featuredItems = Array.isArray(products) ? products.filter(p => p.isFeatured) : [];

  if (featuredItems.length === 0) return null;

  return (
    <section className="py-20 bg-[#0f1012] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-orange-500 mb-2">
              <Zap size={20} />
              <span className="text-sm font-bold uppercase tracking-widest">Premium Selection</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Featured Gadgets
            </h2>
          </div>
          <Link href="/products" className="text-sm text-gray-400 hover:text-orange-500 flex items-center gap-2 transition-colors">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {featuredItems.map((product) => (
              <CarouselItem key={product._id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                <div className="h-full">
                  <ProductCard product={product} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="hidden md:block">
            <CarouselPrevious className="left-0 -translate-x-1/2 bg-zinc-800 text-white border-none hover:bg-orange-600" />
            <CarouselNext className="right-0 translate-x-1/2 bg-zinc-800 text-white border-none hover:bg-orange-600" />
          </div>
        </Carousel>

      </div>
    </section>
  );
}