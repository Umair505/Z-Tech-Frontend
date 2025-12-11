"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export default function CartDrawer({ isOpen, setIsOpen }) {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // --- FETCH CART DATA ---
  const { data: cart = [], isLoading } = useQuery({
    queryKey: ['cart'], 
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get('/cart');
      return res.data;
    }
  });

  // Calculate Subtotal (Handle quantity in calculation)
  const subtotal = cart.reduce((total, item) => total + ((Number(item.price) || 0) * (item.quantity || 1)), 0);
  const freeShippingThreshold = 50000;
  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  // Remove Item
  const handleRemoveItem = async (id) => {
    try {
      const res = await axiosSecure.delete(`/cart/${id}`);
      if (res.data.deletedCount > 0) {
        toast.success("Item removed");
        queryClient.invalidateQueries(['cart']); 
      }
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  // Handle Quantity Change
  const handleQuantity = async (id, action, currentQty) => {
    const qty = currentQty || 1; // Default to 1 if undefined
    const newQty = action === 'inc' ? qty + 1 : qty - 1;
    
    if (newQty < 1) return; // Prevent going below 1

    try {
        // Backend API call
        const res = await axiosSecure.patch(`/cart/${id}`, { quantity: newQty });
        
        if(res.data.modifiedCount > 0){
            // Update UI instantly
            queryClient.invalidateQueries(['cart']);
        }
    } catch (error) {
        console.error("Failed to update quantity", error);
        toast.error("Failed to update quantity");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
              <h2 className="text-xl font-bold text-gray-900">Shopping Cart ({cart.length})</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ShoppingCart size={32} className="text-gray-400" />
                  </div>
                  <p className="text-lg font-medium text-gray-900">Your cart is empty</p>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="mt-6 text-orange-600 font-bold hover:underline"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item._id} className="flex gap-4 group">
                    <div className="h-24 w-20 bg-gray-50 rounded-lg flex-shrink-0 border border-gray-100 flex items-center justify-center relative overflow-hidden">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                      ) : (
                        <div className="text-xs text-gray-400">No Img</div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 pr-4">
                            {item.name}
                          </h3>
                          <button 
                            onClick={() => handleRemoveItem(item._id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="flex items-center border border-gray-200 rounded-md">
                          <button 
                            onClick={() => handleQuantity(item._id, 'dec', item.quantity)}
                            className="px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors disabled:opacity-50"
                            disabled={(item.quantity || 1) <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 text-xs font-medium text-gray-900 w-8 text-center">{item.quantity || 1}</span>
                          <button 
                            onClick={() => handleQuantity(item._id, 'inc', item.quantity)}
                            className="px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-orange-600">৳{((Number(item.price) || 0) * (item.quantity || 1)).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 font-medium">Subtotal:</span>
                  <span className="text-xl font-bold text-gray-900">৳{subtotal.toLocaleString()}</span>
                </div>
                
                {/* Free Shipping Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs mb-1.5">
                    {subtotal >= freeShippingThreshold ? (
                      <span className="text-green-600 font-bold">Free shipping unlocked! 🎉</span>
                    ) : (
                      <span className="text-gray-600">Add <span className="font-bold text-orange-600">৳{(freeShippingThreshold - subtotal).toLocaleString()}</span> for free shipping</span>
                    )}
                    <span className="text-gray-400">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${subtotal >= freeShippingThreshold ? 'bg-green-500' : 'bg-orange-500'}`} 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/cart" onClick={() => setIsOpen(false)}>
                    <button className="w-full py-3 bg-white border border-gray-200 text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-sm">
                      View Cart Page
                    </button>
                  </Link>
                  <Link href="/checkout" onClick={() => setIsOpen(false)}>
                    <button className="w-full py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/20">
                      Checkout Now
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}