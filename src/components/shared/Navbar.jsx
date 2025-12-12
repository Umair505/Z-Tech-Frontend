"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, ShoppingCart, User, Menu, X, Heart, 
  LogOut, LayoutDashboard, 
  ShoppingBag
} from "lucide-react";
import { cn } from "@/lib/utils";
import useAuth from "@/hooks/useAuth";
import useRole from "@/hooks/userRole"; 
import useAxiosSecure from "@/hooks/useAxiosSecure"; 
import { useQuery } from "@tanstack/react-query"; 
import CartDrawer from "./CartDrawer"; 

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); 
  const [isProfileOpen, setIsProfileOpen] = useState(false); 
  const [isCartOpen, setIsCartOpen] = useState(false); 
  const [showLogoutModal, setShowLogoutModal] = useState(false); 
  
  const pathname = usePathname();
  const router = useRouter();
  const { user, logOut } = useAuth();
  const [role] = useRole(); 
  const isAdmin = role === 'admin';
  const axiosSecure = useAxiosSecure(); 

  const dropdownRef = useRef(null);

  const { data: cart = [] } = useQuery({
    queryKey: ['cart'], 
    enabled: !!user?.email, 
    queryFn: async () => {
      const res = await axiosSecure.get('/cart');
      return res.data;
    }
  });

  const { data: wishlist = [] } = useQuery({
    queryKey: ['wishlist'],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get('/wishlist');
      return res.data;
    }
  });

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    setIsOpen(false);
  };

  return (
    <>
      <CartDrawer isOpen={isCartOpen} setIsOpen={setIsCartOpen} />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f1012]/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-1 group">
              <div className="w-8 h-8 bg-orange-500 rounded-br-lg rounded-tl-lg flex items-center justify-center text-white font-bold text-xl group-hover:rotate-3 transition-transform duration-300">
                Z
              </div>
              <span className="text-2xl font-bold tracking-tighter text-white">
                TECH
              </span>
            </Link>

            {/* Desktop Search */}
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

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
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
                
                {isAdmin && (
                   <Link
                   href="/dashboard"
                   className={cn(
                     "text-sm font-medium transition-colors hover:text-orange-400 flex items-center gap-1",
                     pathname.includes('/dashboard') ? "text-orange-500" : "text-gray-300"
                   )}
                 >
                   Dashboard
                 </Link>
                )}
              </div>

              <div className="flex items-center gap-4 border-l border-gray-700 pl-6">
                <Link href="/wishlist">
                <button className="text-gray-300 hover:text-orange-400 transition-colors relative">
                  <Heart size={22} />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </button>
                </Link>
                
                {/* Cart Button */}
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="text-gray-300 hover:text-orange-400 transition-colors relative"
                >
                  <ShoppingCart size={22} />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </button>
                
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
                            width={36} 
                            height={36}
                            className="object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white">
                            <User size={18} />
                          </div>
                        )}
                      </div>
                    </button>

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
                              href="/dashboard" 
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
                            <ShoppingBag size={16} /> My Order
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

            {/* Mobile Icons */}
            <div className="md:hidden flex items-center gap-3">
              <Link href="/wishlist">
                <button className="text-gray-300 relative">
                  <Heart size={22} />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </button>
              </Link>
              
              <button onClick={() => setIsCartOpen(true)} className="text-gray-300 relative">
                  <ShoppingCart size={22} />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
              </button>
              
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-300 hover:text-white focus:outline-none p-1"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0f1012] border-t border-gray-800 overflow-hidden"
            >
               <div className="px-4 py-4 space-y-4 max-h-[calc(100vh-5rem)] overflow-y-auto">
                  
                  {/* Mobile Search */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search gadgets..."
                      className="w-full bg-[#1a1c20] text-gray-200 border border-gray-700 rounded-full py-2.5 pl-5 pr-12 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300 placeholder:text-gray-500"
                    />
                    <button className="absolute right-1 top-1 bottom-1 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full transition-colors duration-300">
                      <Search size={18} />
                    </button>
                  </div>

                  {/* User Profile Section (Mobile) */}
                  {user && (
                    <div className="bg-[#1a1c20] border border-gray-700 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500 flex-shrink-0">
                          {user.photoURL ? (
                            <Image
                              src={user.photoURL} 
                              alt="Profile" 
                              width={48} 
                              height={48}
                              className="object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white">
                              <User size={24} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-bold truncate">{user.displayName || 'User'}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Links */}
                  <div className="space-y-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "block py-3 px-4 rounded-lg text-base font-medium transition-colors",
                          pathname === link.href 
                            ? "bg-orange-500/10 text-orange-500" 
                            : "text-gray-300 hover:bg-gray-800 hover:text-orange-400"
                        )}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>

                  {/* User Actions */}
                  {user && (
                    <div className="space-y-2 pt-2 border-t border-gray-800">
                      {isAdmin && (
                        <Link 
                          href="/dashboard"
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-3 py-3 px-4 rounded-lg text-base font-medium transition-colors",
                            pathname.includes('/dashboard')
                              ? "bg-orange-500/10 text-orange-500"
                              : "text-gray-300 hover:bg-gray-800 hover:text-orange-400"
                          )}
                        >
                          <LayoutDashboard size={20} />
                          <span>Dashboard</span>
                        </Link>
                      )}

                      <Link 
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 py-3 px-4 rounded-lg text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-orange-400 transition-colors"
                      >
                        <ShoppingBag size={20} />
                        <span>My Orders</span>
                      </Link>
                    </div>
                  )}

                  {/* Login/Logout Button */}
                  <div className="pt-2 border-t border-gray-800">
                    {user ? (
                        <button 
                          onClick={() => { setIsOpen(false); setShowLogoutModal(true); }}
                          className="flex items-center justify-center gap-2 w-full bg-red-500/10 text-red-500 py-3 rounded-lg hover:bg-red-500 hover:text-white transition font-medium"
                        >
                          <LogOut size={20} />
                          <span>Logout</span>
                        </button>
                    ) : (
                        <Link 
                          href="/login" 
                          onClick={() => setIsOpen(false)} 
                          className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg transition font-medium"
                        >
                          <User size={20} /> 
                          <span>Login</span>
                        </Link>
                    )}
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-[#1a1c20] border border-gray-700 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center"
            >
               <h3 className="text-xl font-bold text-white mb-2">Log Out?</h3>
               <p className="text-gray-400 text-sm mb-4">Are you sure you want to log out?</p>
               <div className="flex gap-3">
                  <button 
                    onClick={() => setShowLogoutModal(false)} 
                    className="flex-1 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleLogoutConfirm} 
                    className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition font-medium"
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