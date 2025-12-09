'use client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
// import Image from "next/image"; // Commented out to fix preview error

// Dummy Brand Data (Replace with your real logo paths)
const brands = [
  { id: 1, name: "Apple", logo: "https://placehold.co/150x50/white/black?text=Apple" },
  { id: 2, name: "Samsung", logo: "https://placehold.co/150x50/white/black?text=Samsung" },
  { id: 3, name: "Sony", logo: "https://placehold.co/150x50/white/black?text=Sony" },
  { id: 4, name: "Dell", logo: "https://placehold.co/150x50/white/black?text=Dell" },
  { id: 5, name: "HP", logo: "https://placehold.co/150x50/white/black?text=HP" },
  { id: 6, name: "Logitech", logo: "https://placehold.co/150x50/white/black?text=Logitech" },
  { id: 7, name: "Canon", logo: "https://placehold.co/150x50/white/black?text=Canon" },
  { id: 8, name: "Bose", logo: "https://placehold.co/150x50/white/black?text=Bose" },
];

export default function BrandCarousel() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
            Exclusive Brands In Our Store
          </h2>
          <p className="text-gray-500 text-sm md:text-base">
            We partner with the world's leading tech companies to bring you the best quality.
          </p>
        </div>

        {/* Carousel Area with Borders */}
        <div className="border-t border-b border-gray-100 py-10 relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 2000,
                stopOnInteraction: false,
              }),
            ]}
            className="w-full px-8 md:px-12"
          >
            <CarouselContent className="-ml-4 items-center">
              {brands.map((brand) => (
                <CarouselItem key={brand.id} className="pl-4 basis-1/2 md:basis-1/4 lg:basis-1/6">
                  <div className="flex items-center justify-center p-4 opacity-50 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0 cursor-pointer">
                    {/* Using standard img tag for preview compatibility */}
                    <div className="relative w-[120px] h-[50px]">
                      <img 
                        src={brand.logo} 
                        alt={brand.name} 
                        className="object-contain w-full h-full"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation Buttons */}
            <CarouselPrevious className="left-0 md:-left-4 border-gray-200 text-gray-400 hover:text-orange-600 hover:border-orange-600" />
            <CarouselNext className="right-0 md:-right-4 border-gray-200 text-gray-400 hover:text-orange-600 hover:border-orange-600" />
          </Carousel>
        </div>

      </div>
    </section>
  );
}