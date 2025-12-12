'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function SearchBar({ className = '', onSearch, placeholder = "Search gadgets..." }) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    
    if (trimmedQuery) {
      // Redirect to products page with search query
      router.push(`/products?search=${encodeURIComponent(trimmedQuery)}`);
      
      // Optional callback (e.g., to close mobile menu)
      if (onSearch) {
        onSearch();
      }
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative group ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-[#1a1c20] text-gray-200 border border-gray-700 rounded-full py-2.5 pl-5 pr-12 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300 placeholder:text-gray-500"
      />
      <button 
        type="submit"
        className="absolute right-1 top-1 bottom-1 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!query.trim()}
      >
        <Search size={18} />
      </button>
    </form>
  );
}