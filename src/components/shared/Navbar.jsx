"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, ShoppingCart, User, Menu, X, Heart, 
  LogOut, LayoutDashboard, Settings, ChevronDown 
} from "lucide-react";
import { cn } from "@/lib/utils";
import useAuth from "@/hooks/useAuth";
import useRole from "@/hooks/userRole"; 

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Mobile Menu
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Profile Dropdown
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Logout Modal
  
  const pathname = usePathname();
  const { user, logOut } = useAuth();
  const [role] = useRole(); // Role Check Hook
  const isAdmin = role === 'admin';

  const dropdownRef = useRef(null);

  // Dropdown এর বাইরে ক্লিক করলে বন্ধ করার লজিক
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navigation Links
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleLogoutConfirm = async () => {
    await logOut();
    setShowLogoutModal(false);
    setIsProfileOpen(false);
  };

  return (
    <>
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

            {/* 2. Desktop Search Bar */}
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
                
                {/* Admin Dashboard Link (Visible to Admin Only) */}
                {isAdmin && (
                   <Link
                   href="/dashboard/admin"
                   className={cn(
                     "text-sm font-medium transition-colors hover:text-orange-400 flex items-center gap-1",
                     pathname.includes('/dashboard') ? "text-orange-500" : "text-gray-300"
                   )}
                 >
                   Dashboard
                 </Link>
                )}
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
                
                {/* --- USER PROFILE SECTION --- */}
                {user ? (
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 focus:outline-none"
                    >
                      <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-transparent hover:border-orange-500 transition-all">
                        {user.photoURL ? (
                          <Image
                            src={user.photoURL} 
                            alt="Profile" 
                            width={36}   // w-9 means 36px (9 * 4)
                            height={36}  // w-9 means 36px
                            className="object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white">
                            <User size={18} />
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Profile Dropdown */}
                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-3 w-56 bg-[#1a1c20] border border-gray-700 rounded-xl shadow-2xl py-2 overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-gray-700/50">
                            <p className="text-sm text-white font-bold truncate">{user.displayName || 'User'}</p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          </div>

                          {isAdmin && (
                            <Link 
                              href="/dashboard/admin" 
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-orange-400 transition-colors"
                            >
                              <LayoutDashboard size={16} /> Admin Dashboard
                            </Link>
                          )}

                          <Link 
                            href="/profile" 
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-orange-400 transition-colors"
                          >
                            <User size={16} /> My Profile
                          </Link>

                          
                          <div className="border-t border-gray-700/50 mt-1">
                            <button 
                              onClick={() => setShowLogoutModal(true)}
                              className="w-full text-left flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                            >
                              <LogOut size={16} /> Logout
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link href="/login" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-gray-700 transition-all text-sm font-medium text-gray-200 hover:border-orange-500/50">
                    <User size={18} />
                    <span>Login</span>
                  </Link>
                )}
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
                onClick={() => setIsOpen(!isOpen)}
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
                    placeholder="Search..."
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
                  
                  {isAdmin && (
                     <Link
                     href="/dashboard/admin"
                     onClick={() => setIsOpen(false)}
                     className="block px-3 py-3 rounded-md text-base font-medium text-orange-400 hover:bg-gray-800"
                   >
                     Admin Dashboard
                   </Link>
                  )}
                </div>

                {/* Mobile User Actions */}
                <div className="pt-4 border-t border-gray-800">
                   {user ? (
                     <div className="space-y-3">
                        <div className="flex items-center gap-3 px-2 mb-4">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700">
                              {user.photoURL ? (
                                <Image 
                                    src={user.photoURL} 
                                    alt="Profile" 
                                    width={36}   
                                    height={36}  
                                    className="object-cover" 
                                  />
                              ) : <User className="w-full h-full p-2 text-gray-400" />}
                            </div>
                            <div>
                                <p className="text-white font-medium">{user.displayName}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                        </div>
                        <Link href="/profile" onClick={() => setIsOpen(false)} className="block w-full text-center bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700">
                           View Profile
                        </Link>
                        <button 
                          onClick={() => { setIsOpen(false); setShowLogoutModal(true); }}
                          className="block w-full bg-red-500/10 text-red-500 py-3 rounded-lg hover:bg-red-500 hover:text-white transition"
                        >
                           Logout
                        </button>
                     </div>
                   ) : (
                     <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 bg-gray-800 text-white py-2.5 rounded-lg hover:bg-gray-700 transition">
                          <Heart size={18} /> Wishlist
                        </button>
                        <Link href="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 bg-orange-600 text-white py-2.5 rounded-lg hover:bg-orange-700 transition">
                          <User size={18} /> Login
                        </Link>
                     </div>
                   )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- LOGOUT CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-[#1a1c20] border border-gray-700 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center"
            >
               <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-red-500">
                  <LogOut size={24} />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Log Out?</h3>
               <p className="text-gray-400 mb-6">Are you sure you want to log out of your account?</p>
               
               <div className="flex gap-3">
                  <button 
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 py-2.5 rounded-lg bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleLogoutConfirm}
                    className="flex-1 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                  >
                    Yes, Logout
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}