'use client'
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import { Trash2, Heart, ArrowRight, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const axiosSecure = useAxiosSecure();

  // Fetch Wishlist Items
  const { data: wishlist = [], refetch, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const res = await axiosSecure.get('/wishlist');
      return res.data;
    }
  });

  // Delete Item
  const handleDelete = async (id) => {
    try {
        const res = await axiosSecure.delete(`/wishlist/${id}`);
        if (res.data.deletedCount > 0) {
            refetch();
            toast.success("Removed from wishlist");
        }
    } catch (error) {
        toast.error("Failed to remove");
    }
  };

  // Add to Cart from Wishlist
  const handleAddToCart = async (item) => {
      // Implement add to cart logic (similar to ProductCard)
      // For now just redirecting or showing toast
      toast.success("Feature coming soon: Direct add from wishlist");
  }

  if (isLoading) return <div className="min-h-screen flex justify-center items-center">Loading...</div>;

  if (wishlist.length === 0) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-400">
                  <Heart size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Your wishlist is empty</h2>
              <Link href="/products">
                  <button className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-black transition-all flex items-center gap-2">
                      Explore Products <ArrowRight size={20} />
                  </button>
              </Link>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist ({wishlist.length})</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => (
                <div key={item._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
                    <div className="relative h-48 bg-gray-50 flex items-center justify-center p-4">
                        {item.image ? (
                            <Image src={item.image} alt={item.name} fill className="object-contain p-4" />
                        ) : (
                            <div className="text-gray-300">No Image</div>
                        )}
                        <button 
                            onClick={() => handleDelete(item._id)}
                            className="absolute top-3 right-3 p-2 bg-white text-red-500 rounded-full shadow-sm hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                    
                    <div className="p-5">
                        <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">{item.name}</h3>
                        <p className="text-orange-600 font-bold mb-4">৳{item.price?.toLocaleString()}</p>
                        
                        <div className="flex gap-2">
                            <Link href={`/products/${item.productId}`} className="flex-1">
                                <button className="w-full py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">
                                    View Details
                                </button>
                            </Link>
                            {/* Optional: Add to cart button */}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}