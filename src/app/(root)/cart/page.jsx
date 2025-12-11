'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import { Trash2, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function CartPage() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch Cart Items
  const { data: cart = [], refetch, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await axiosSecure.get('/cart');
      return res.data;
    }
  });

  // Calculate Total
  const subtotal = cart.reduce((total, item) => total + ((Number(item.price) || 0) * (item.quantity || 1)), 0);
  const shipping = 120; 
  const total = subtotal + shipping;

  // Handle Quantity Change
  const handleQuantity = async (id, action, currentQty) => {
    const qty = currentQty || 1;
    const newQty = action === 'inc' ? qty + 1 : qty - 1;
    
    if (newQty < 1) return; 

    try {
        const res = await axiosSecure.patch(`/cart/${id}`, { quantity: newQty });
        if(res.data.modifiedCount > 0){
            queryClient.invalidateQueries(['cart']); // Update globally
        }
    } catch (error) {
        toast.error("Failed to update quantity");
    }
  };

  // Delete Item
  const handleDelete = (id) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "Remove this item from cart?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, remove it!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await axiosSecure.delete(`/cart/${id}`);
                if (res.data.deletedCount > 0) {
                    queryClient.invalidateQueries(['cart']); // Update globally
                    toast.success("Item removed from cart");
                }
            } catch (error) {
                toast.error("Failed to remove item");
            }
        }
    });
  };

  if (isLoading) {
      return <div className="min-h-screen flex items-center justify-center">Loading cart...</div>;
  }

  if (cart.length === 0) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                  <ShoppingBag size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
              <p className="text-gray-500">Looks like you haven't added anything yet.</p>
              <Link href="/products">
                  <button className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-700 transition-all flex items-center gap-2">
                      Start Shopping <ArrowRight size={20} />
                  </button>
              </Link>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart ({cart.length})</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Cart Items List */}
            <div className="flex-1 space-y-4">
                {cart.map((item) => (
                    <div key={item._id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="h-24 w-24 bg-gray-50 rounded-lg flex-shrink-0 relative overflow-hidden border border-gray-200">
                            {item.image ? (
                                <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">No Img</div>
                            )}
                        </div>
                        
                        <div className="flex-1 text-center sm:text-left">
                            <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{item.name}</h3>
                            <p className="text-sm text-gray-500">{item.category}</p>
                            <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                                <span className="text-orange-600 font-bold">৳{Number(item.price).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-200 rounded-md">
                          <button 
                            onClick={() => handleQuantity(item._id, 'dec', item.quantity)}
                            className="px-3 py-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors disabled:opacity-50"
                            disabled={(item.quantity || 1) <= 1}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-3 text-sm font-bold text-gray-900 w-8 text-center">{item.quantity || 1}</span>
                          <button 
                            onClick={() => handleQuantity(item._id, 'inc', item.quantity)}
                            className="px-3 py-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <button 
                            onClick={() => handleDelete(item._id)}
                            className="p-3 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            title="Remove"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Order Summary */}
            <div className="lg:w-96">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-24">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                    
                    <div className="space-y-3 mb-6 border-b border-gray-100 pb-6">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>৳{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span>৳{shipping.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex justify-between text-xl font-bold text-gray-900 mb-8">
                        <span>Total</span>
                        <span>৳{total.toLocaleString()}</span>
                    </div>

                    <Link href="/checkout">
                        <button className="w-full bg-orange-600 text-white py-3.5 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20">
                            Proceed to Checkout
                        </button>
                    </Link>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}