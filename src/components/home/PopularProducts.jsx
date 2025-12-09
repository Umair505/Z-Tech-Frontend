'use client';
import { TrendingUp, ArrowRight } from 'lucide-react';
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
export default function PopularProducts({ products = [] }) {
  // FIX: Added safety check
  const popularItems = Array.isArray(products) ? products.filter(p => p.isPopular) : [];

  if (popularItems.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2.5 rounded-full">
                    <TrendingUp className="text-orange-600" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
            </div>
        </div>

        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent className="-ml-4">
            {popularItems.map((product) => (
              <CarouselItem key={product._id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4 bg-white shadow-lg border-none" />
          <CarouselNext className="-right-4 bg-white shadow-lg border-none" />
        </Carousel>

        <div className="mt-12 text-center">
            <Link 
                href="/products"
                className="inline-flex items-center justify-center px-8 py-3 border border-gray-200 shadow-sm text-sm font-bold rounded-full text-gray-700 bg-white hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-all transform hover:-translate-y-1"
            >
                View All Trending Items <ArrowRight size={16} className="ml-2"/>
            </Link>
        </div>
      </div>
    </section>
  );
}