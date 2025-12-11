'use client';
import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import ProductCard from '@/components/cards/ProductCard'; // ১. স্মার্ট কার্ড ইম্পোর্ট

export default function ProductsPage() {
  // --- States ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200000 });

  // Categories List
  const categories = [
    "All",
    "Smartphones",
    "Laptops",
    "Tablets & iPads",
    "Smart Watches",
    "Headphones",
    "Earbuds",
    "Earphone",
    "Speakers & Audio",
    "Gaming Consoles",
    "VR & AR",
    "Cameras & Drones",
    "Smart Home",
    "Accessories"
  ];

  // --- Fetch Data ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Artificial delay for UX demo
        await new Promise(resolve => setTimeout(resolve, 800)); 
        
        const res = await fetch('http://localhost:5000/products');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // --- Filter Logic ---
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesPrice = (product.price || 0) >= priceRange.min && (product.price || 0) <= priceRange.max;

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, searchQuery, selectedCategory, priceRange]);

  // --- Handlers ---
  const handlePriceChange = (e, type) => {
    const value = parseInt(e.target.value) || 0;
    setPriceRange(prev => ({ ...prev, [type]: value }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setPriceRange({ min: 0, max: 200000 });
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#1a1c20] font-sans pb-20">
      
      {/* 1. Header & Mobile Filter Toggle */}
      <div className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-orange-600">Explore Gadgets</h1>
          
          <button 
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
          >
            <Filter size={18} /> Filters
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* 2. Sidebar Filters (Desktop & Mobile) */}
          <aside className={`
            lg:w-1/4 lg:block 
            ${isMobileFilterOpen ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden'}
            lg:static lg:bg-transparent lg:p-0 lg:h-auto
          `}>
            <div className="flex justify-between items-center lg:hidden mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <button onClick={() => setIsMobileFilterOpen(false)}><X size={24} /></button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-8 sticky top-24">
              
              {/* Search */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                  <Search size={16} /> Search
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search product..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Category */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                  <SlidersHorizontal size={16} /> Category
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${selectedCategory === cat ? 'bg-orange-500 border-orange-500' : 'border-gray-300 group-hover:border-orange-400'}`}>
                        {selectedCategory === cat && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <input 
                        type="radio" 
                        name="category" 
                        value={cat} 
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="hidden" 
                      />
                      <span className={`text-sm ${selectedCategory === cat ? 'font-medium text-orange-600' : 'text-gray-600 group-hover:text-gray-900'}`}>
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Price Range (BDT)</h3>
                <div className="flex items-center gap-2 mb-4">
                  <input 
                    type="number" 
                    value={priceRange.min} 
                    onChange={(e) => handlePriceChange(e, 'min')}
                    className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:border-orange-500 outline-none"
                    placeholder="Min"
                  />
                  <span className="text-gray-400">-</span>
                  <input 
                    type="number" 
                    value={priceRange.max} 
                    onChange={(e) => handlePriceChange(e, 'max')}
                    className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:border-orange-500 outline-none"
                    placeholder="Max"
                  />
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="200000" 
                  step="1000"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange(e, 'max')}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>0 Tk</span>
                  <span>2L+ Tk</span>
                </div>
              </div>

              {/* Reset Button */}
              <button 
                onClick={clearFilters}
                className="w-full py-2.5 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 hover:text-orange-600 transition-colors text-sm"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* 3. Product Grid Area */}
          <main className="lg:w-3/4">
            
            {/* Header: Count & Sort */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-500 text-sm">
                Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> results
              </p>
            </div>

            {loading ? (
              // --- Loading Skeletons ---
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-8 bg-gray-200 rounded w-8"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              
              // --- Product Grid (Using Reusable Component) ---
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  // ২. এখানে আগের ইনলাইন কোডের বদলে কম্পোনেন্ট ব্যবহার করা হয়েছে
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              
            ) : (
              // --- Empty State ---
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-dashed border-gray-300">
                <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                  <Search size={40} className="text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                  We couldn't find any gadgets matching your filters. Try adjusting your search or category.
                </p>
                <button 
                  onClick={clearFilters}
                  className="px-8 py-3 bg-orange-600 text-white font-bold rounded-full shadow-lg hover:bg-orange-700 transition-all hover:scale-105"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}