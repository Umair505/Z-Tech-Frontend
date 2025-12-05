"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, User, Menu, X, Heart } from "lucide-react";
import { cn } from "@/lib/utils"; // If using shadcn's utility, otherwise remove this import and use standard string interpolation

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Navigation Links Configuration
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f1012]/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* 1. Logo Section */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-1 group">
            <div className="w-8 h-8 bg-orange-500 rounded-br-lg rounded-tl-lg flex items-center justify-center text-white font-bold text-xl group-hover:rotate-3 transition-transform duration-300">
              Z
            </div>
            <span className="text-2xl font-bold tracking-tighter text-white">
              TECH
            </span>
          </Link>

          {/* 2. Desktop Search Bar (Hidden on Mobile) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4 relative group">
            <input
              type="text"
              placeholder="Search gadgets..."
              className="w-full bg-[#1a1c20] text-gray-200 border border-gray-700 rounded-full py-2.5 pl-5 pr-12 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300 placeholder:text-gray-500"
            />
            <button className="absolute right-1 top-1 bottom-1 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full transition-colors duration-300">
              <Search size={18} />
            </button>
          </div>

          {/* 3. Desktop Actions & Links */}
          <div className="hidden md:flex items-center gap-6">
            {/* Links */}
            <div className="flex gap-6 mr-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-orange-400",
                    pathname === link.href ? "text-orange-500" : "text-gray-300"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-4 border-l border-gray-700 pl-6">
              <button className="text-gray-300 hover:text-orange-400 transition-colors relative">
                <Heart size={22} />
              </button>
              
              <Link href="/cart" className="text-gray-300 hover:text-orange-400 transition-colors relative">
                <ShoppingCart size={22} />
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  2
                </span>
              </Link>
              
              <Link href="/login" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md border border-gray-700 transition-all text-sm font-medium text-gray-200">
                <User size={18} />
                <span>Account</span>
              </Link>
            </div>
          </div>

          {/* 4. Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <Link href="/cart" className="text-gray-300 relative">
                <ShoppingCart size={22} />
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  2
                </span>
            </Link>
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none p-1"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Mobile Menu (Animated Drawer) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-[#0f1012] border-t border-gray-800 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-6">
              
              {/* Mobile Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="w-full bg-[#1a1c20] text-gray-200 border border-gray-700 rounded-lg py-3 pl-4 pr-12 focus:outline-none focus:border-orange-500"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white px-3 rounded-md transition-colors">
                  <Search size={18} />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block px-3 py-3 rounded-md text-base font-medium transition-all hover:bg-gray-800",
                      pathname === link.href
                        ? "text-orange-500 bg-gray-800/50"
                        : "text-gray-300"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Mobile User Actions */}
              <div className="pt-4 border-t border-gray-800 grid grid-cols-2 gap-4">
                 <button className="flex items-center justify-center gap-2 bg-gray-800 text-white py-2.5 rounded-lg hover:bg-gray-700 transition">
                   <Heart size={18} /> Wishlist
                 </button>
                 <Link href="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 bg-orange-600 text-white py-2.5 rounded-lg hover:bg-orange-700 transition">
                   <User size={18} /> Login
                 </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}