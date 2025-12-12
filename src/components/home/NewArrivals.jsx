'use client';
import { Sparkles } from 'lucide-react';
import ProductCard from '@/components/cards/ProductCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// FIX: Added default empty array to props
export default function NewArrivals({ products = [] }) {
  // FIX: Added safety check for .filter
  const newItems = Array.isArray(products) ? products.filter(p => p.isNewArrival) : [];

  if (newItems.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <span className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wide mb-4">
            <Sparkles size={14} /> Just Landed
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">New Arrivals</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Check out the latest tech gadgets that just hit our store.
          </p>
        </div>

        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-4">
            {newItems.map((product) => (
              <CarouselItem key={product._id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent> 
          <div className="hidden md:block">
            <CarouselPrevious className="left-2 bg-white border-gray-200 hover:text-orange-600" />
            <CarouselNext className="right-2 bg-white border-gray-200 hover:text-orange-600" />
          </div>
        </Carousel>

      </div>
    </section>
  );
}