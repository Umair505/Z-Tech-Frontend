'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Eye, Heart, Loader2 } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useQueryClient, useQuery } from '@tanstack/react-query';

const ProductCard = ({ product }) => {
  const { _id, name, price, category, images, status, isNewArrival } = product;
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [loadingCart, setLoadingCart] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Check if item is already in wishlist using React Query
  const { data: wishlist = [] } = useQuery({
    queryKey: ['wishlist', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get('/wishlist');
      return res.data;
    }
  });

  // Check if *this* product is in the wishlist
  const wishlistItem = wishlist.find((item) => item.productId === _id);
  const isWishlisted = !!wishlistItem;

  // Handle Add to Cart
  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add to cart");
      return router.push('/login');
    }

    setLoadingCart(true);
    const cartItem = {
      productId: _id,
      name,
      image: images?.[0],
      price,
      category,
      email: user.email,
      quantity: 1
    };

    try {
      await axiosSecure.post('/cart', cartItem);
      toast.success("Added to cart!");
      queryClient.invalidateQueries(['cart']); 
    } catch (error) {
      if(error.response?.data?.message){
          toast.error(error.response.data.message);
      } else {
          toast.error("Failed to add to cart");
      }
    } finally {
      setLoadingCart(false);
    }
  };

  // Handle Toggle Wishlist (Add/Remove)
  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error("Please login to manage wishlist");
      return router.push('/login');
    }

    setWishlistLoading(true);

    try {
      if (isWishlisted) {
        // Remove from wishlist
        await axiosSecure.delete(`/wishlist/${wishlistItem._id}`);
        toast.success("Removed from wishlist");
      } else {
        // Add to wishlist
        const wishlistItemData = {
          productId: _id,
          name,
          image: images?.[0],
          price,
          category,
          email: user.email
        };
        await axiosSecure.post('/wishlist', wishlistItemData);
        toast.success("Added to wishlist!");
      }
      // Refresh the wishlist state
      queryClient.invalidateQueries(['wishlist']);
    } catch (error) {
        const errorMsg = error.response?.data?.message || "Something went wrong";
        toast.error(errorMsg);
    } finally {
        setWishlistLoading(false);
    }
  };

  const isStockOut = status === 'out-of-stock' || product.stock <= 0;

  return (
    <div className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 h-full flex flex-col">
      
      {/* Badge */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {isNewArrival && !isStockOut && (
          <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
            New
          </span>
        )}
        {isStockOut && (
          <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
            Sold Out
          </span>
        )}
      </div>

      {/* Wishlist Button (Top Right - Always Visible on Mobile, Hover on Desktop) */}
      <button
        onClick={handleToggleWishlist}
        disabled={wishlistLoading}
        className={`absolute top-3 right-3 z-10 p-2.5 rounded-full shadow-lg transition-all
          lg:opacity-0 lg:group-hover:opacity-100
          ${isWishlisted 
            ? 'bg-red-50 text-red-500 border border-red-200' 
            : 'bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-red-500 hover:text-white'}`}
        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        {wishlistLoading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        )}
      </button>

      {/* Image Container with Next.js Image */}
      <div className="relative h-56 sm:h-64 w-full bg-gray-50 overflow-hidden">
        {images?.[0] ? (
          <Image
            src={images[0]}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-contain p-4 sm:p-6 transition-transform duration-500 group-hover:scale-110 ${isStockOut ? 'opacity-60 grayscale' : ''}`}
          />
        ) : (
           <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No Image</div>
        )}
        
        {/* Desktop Hover Actions Overlay (Hidden on Mobile) */}
        <div className="hidden lg:flex absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center gap-3">
          
          {/* View Details Button */}
          <Link 
            href={`/products/${_id}`}
            className="p-3 bg-white text-gray-700 rounded-full shadow-lg hover:bg-orange-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300"
            title="View Details"
          >
            <Eye size={20} />
          </Link>

          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            className={`p-3 bg-white text-gray-700 rounded-full shadow-lg hover:bg-orange-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75 disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isStockOut ? "Out of Stock" : "Add to Cart"}
            disabled={isStockOut || loadingCart}
          >
            {loadingCart ? <Loader2 className="animate-spin" size={20}/> : <ShoppingCart size={20} />}
          </button>
        </div>

        {/* Mobile/Tablet Action Buttons (Always Visible, Bottom of Image) */}
        <div className="lg:hidden absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center justify-center gap-2">
            {/* View Details Button */}
            <Link 
              href={`/products/${_id}`}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/95 backdrop-blur-sm text-gray-800 rounded-lg hover:bg-white transition-all font-medium text-sm"
              title="View Details"
            >
              <Eye size={16} />
              <span>View</span>
            </Link>

            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all font-medium text-sm
                ${isStockOut 
                  ? 'bg-gray-400/95 text-white cursor-not-allowed' 
                  : 'bg-orange-600/95 backdrop-blur-sm text-white hover:bg-orange-600'}`}
              title={isStockOut ? "Out of Stock" : "Add to Cart"}
              disabled={isStockOut || loadingCart}
            >
              {loadingCart ? (
                <Loader2 className="animate-spin" size={16}/>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  <span className="hidden xs:inline">{isStockOut ? 'Sold Out' : 'Add'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <p className="text-[10px] sm:text-xs text-orange-500 font-semibold uppercase tracking-wide mb-1">
          {category}
        </p>
        <Link href={`/products/${_id}`}>
          <h3 className="text-gray-900 font-bold text-base sm:text-lg mb-2 line-clamp-2 hover:text-orange-600 transition-colors leading-tight">
            {name}
          </h3>
        </Link>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg sm:text-xl font-extrabold text-gray-900">
            ৳{price?.toLocaleString()}
          </span>
          <div className="flex text-yellow-400 text-xs">
            {'★'.repeat(5)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;