'use client';
import { useEffect, useState } from 'react';
// Fixing imports to use relative paths to avoid alias resolution errors
import HeroSection from "../HeroSection";
import FeaturedProducts from "./FeaturedProducts";
import NewArrivals from "./NewArrivals";
import PopularProducts from "./PopularProducts";
import SpecialOffer from './SpecialOffer';

export default function HomeView({ initialProducts = [] }) {
  // Initialize with empty array if initialProducts is null/undefined
  const [products, setProducts] = useState(initialProducts || []);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. Check Local Storage on Mount
    const cachedData = localStorage.getItem('ztech_products');
    
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        // Safety check to ensure parsed data is an array
        if (Array.isArray(parsed)) {
            setProducts(parsed);
        }
      } catch (e) {
        console.error("Error parsing local storage", e);
      }
    } else {
      if (initialProducts && initialProducts.length > 0) {
        localStorage.setItem('ztech_products', JSON.stringify(initialProducts));
      }
    }
    
    // 2. Background Refresh
    if (initialProducts && initialProducts.length > 0) {
       // Only update if server data is different/newer
       if (cachedData !== JSON.stringify(initialProducts)) {
           setProducts(initialProducts);
           localStorage.setItem('ztech_products', JSON.stringify(initialProducts));
       }
    }

    setIsLoaded(true);
  }, [initialProducts]);

  // Prevent hydration mismatch or render issues by ensuring products is an array
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <div className="bg-white min-h-screen">
      <HeroSection />
      
      <div className="flex flex-col gap-0">
        {/* Pass safeProducts to children */}
        <NewArrivals products={safeProducts} />
        <FeaturedProducts products={safeProducts} />
        <PopularProducts products={safeProducts} />
        <SpecialOffer />
      </div>
    </div>
  );
}