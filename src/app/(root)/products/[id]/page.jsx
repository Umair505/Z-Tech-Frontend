'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ShoppingCart, Heart, Share2, CheckCircle, AlertCircle, 
  Truck, ShieldCheck, RefreshCw, Star, Minus, Plus, ChevronRight, Loader2 
} from 'lucide-react';
import { toast } from 'sonner';
import useAuth from '@/hooks/useAuth';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import { useQueryClient } from '@tanstack/react-query';

export default function ProductDetailsPage() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  
  // Custom Hooks
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // States
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true); 
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
        setSelectedImage(data.images?.[0] || '');
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // --- Check Wishlist Status ---
  useEffect(() => {
    if (user && id) {
      // Check if item is already in wishlist
    }
  }, [user, id]);

  // --- Handlers ---
  const handleQuantityChange = (type) => {
    if (type === 'inc') {
      if (quantity < (product?.stock || 1)) setQuantity(prev => prev + 1);
      else toast.warning("Max stock limit reached!");
    } else {
      if (quantity > 1) setQuantity(prev => prev - 1);
    }
  };

  // Add to Cart Logic
  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add to cart");
      return router.push('/login');
    }

    setActionLoading(true);
    const cartItem = {
      productId: product._id,
      name: product.name,
      image: product.images?.[0],
      price: product.price,
      category: product.category,
      email: user.email,
      quantity: quantity
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
      setActionLoading(false);
    }
  };

  // Add to Wishlist Logic
  const handleAddToWishlist = async () => {
    if (!user) {
      toast.error("Please login to add to wishlist");
      return router.push('/login');
    }

    const wishlistItem = {
      productId: product._id,
      name: product.name,
      image: product.images?.[0],
      price: product.price,
      category: product.category,
      email: user.email
    };

    try {
      await axiosSecure.post('/wishlist', wishlistItem);
      toast.success("Added to wishlist!");
      setIsWishlisted(true);
      queryClient.invalidateQueries(['wishlist']);
    } catch (error) {
        if(error.response?.data?.message){
            toast.error(error.response.data.message);
            if(error.response.data.message === "Already in wishlist") setIsWishlisted(true);
        } else {
            toast.error("Failed to add to wishlist");
        }
    }
  };

  if (loading) return <ProductSkeleton />;
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center py-20">
        <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg">Product Not Found</p>
      </div>
    </div>
  );

  const isInStock = product.stock > 0;
  const discountPrice = product.price + (product.price * 0.1); 

  return (
    <div className="bg-white min-h-screen font-sans pb-10 sm:pb-20">
      
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center text-xs sm:text-sm text-gray-500 overflow-x-auto">
            <Link href="/" className="hover:text-orange-600 whitespace-nowrap">Home</Link>
            <ChevronRight size={14} className="mx-1 sm:mx-2 flex-shrink-0" />
            <Link href="/products" className="hover:text-orange-600 whitespace-nowrap">Products</Link>
            <ChevronRight size={14} className="mx-1 sm:mx-2 flex-shrink-0" />
            <span className="text-gray-900 font-medium truncate max-w-[150px] sm:max-w-none">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          
          {/* --- LEFT: Image Gallery --- */}
          <div className="space-y-4 sm:space-y-6">
            <div className="relative h-[300px] sm:h-[400px] md:h-[500px] bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden group flex items-center justify-center">
              {product.isNewArrival && (
                <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-blue-600 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1 rounded-full z-10">NEW</span>
              )}
              {selectedImage ? (
                <img 
                  src={selectedImage} 
                  alt={product.name} 
                  className="w-full h-full object-contain p-4 sm:p-8 transition-transform duration-500 group-hover:scale-110 cursor-zoom-in" 
                />
              ) : (
                <div className="text-gray-300 text-sm">No Image</div>
              )}
            </div>

            {product.images?.length > 1 && (
              <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all ${selectedImage === img ? 'border-orange-500 ring-2 ring-orange-100' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* --- RIGHT: Product Info --- */}
          <div>
            {/* Category & Brand */}
            <div className="mb-3 sm:mb-2 flex flex-wrap items-center gap-2">
              <span className="text-orange-600 font-semibold text-xs sm:text-sm uppercase tracking-wider">{product.category}</span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500 text-xs sm:text-sm">Brand: <span className="text-gray-900 font-medium">{product.brand}</span></span>
            </div>

            {/* Product Name */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4 leading-tight">{product.name}</h1>

            {/* Rating & Stock */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex items-center text-yellow-400 text-xs sm:text-sm">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" className="sm:w-4 sm:h-4" />)}
              </div>
              <span className="text-xs sm:text-sm text-gray-500">(12 Reviews)</span>
              <div className={`flex items-center gap-1 text-xs sm:text-sm font-medium ${isInStock ? 'text-green-600' : 'text-red-500'}`}>
                {isInStock ? <CheckCircle size={14} className="sm:w-4 sm:h-4" /> : <AlertCircle size={14} className="sm:w-4 sm:h-4" />}
                {isInStock ? `In Stock (${product.stock})` : 'Out of Stock'}
              </div>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-end gap-2 sm:gap-3 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-100">
              <span className="text-3xl sm:text-4xl font-bold text-orange-600">৳{product.price?.toLocaleString()}</span>
              <span className="text-lg sm:text-xl text-gray-400 line-through mb-0.5 sm:mb-1">৳{discountPrice.toFixed(0)}</span>
              <span className="text-xs sm:text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded mb-1 sm:mb-2">10% OFF</span>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6 sm:mb-8">
              {product.description?.substring(0, 200)}...
              <button 
                onClick={() => {
                  setActiveTab('description');
                  document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="text-orange-600 font-medium ml-1 hover:underline text-sm"
              >
                Read more
              </button>
            </p>

            {/* Actions - Mobile Optimized */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {/* Quantity Selector - Full Width on Mobile */}
              <div className="flex items-center justify-between sm:justify-start gap-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-full h-10 sm:h-12 w-28 sm:w-32">
                  <button 
                    onClick={() => handleQuantityChange('dec')}
                    className="w-9 sm:w-10 h-full flex items-center justify-center text-gray-500 hover:text-orange-600 transition active:scale-95"
                    disabled={!isInStock}
                  >
                    <Minus size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                  <div className="flex-1 text-center font-bold text-gray-900 text-sm sm:text-base">{quantity}</div>
                  <button 
                    onClick={() => handleQuantityChange('inc')}
                    className="w-9 sm:w-10 h-full flex items-center justify-center text-gray-500 hover:text-orange-600 transition active:scale-95"
                    disabled={!isInStock}
                  >
                    <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                </div>
              </div>

              {/* Add to Cart & Wishlist Buttons */}
              <div className="flex gap-3">
                {/* Add to Cart - Takes Most Space */}
                <button 
                  onClick={handleAddToCart}
                  disabled={!isInStock || actionLoading}
                  className={`flex-1 h-12 sm:h-14 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all transform active:scale-95 ${
                    isInStock 
                    ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-orange-200' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {actionLoading ? (
                    <Loader2 className="animate-spin" size={20}/>
                  ) : (
                    <>
                      <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
                      <span className="hidden xs:inline">{isInStock ? 'Add to Cart' : 'Out of Stock'}</span>
                      <span className="xs:hidden">{isInStock ? 'Add' : 'Stock Out'}</span>
                    </>
                  )}
                </button>

                {/* Wishlist Button - Fixed Width */}
                <button 
                  onClick={handleAddToWishlist}
                  className={`h-12 sm:h-14 w-12 sm:w-14 border rounded-full flex items-center justify-center transition-all active:scale-95 flex-shrink-0 ${
                      isWishlisted 
                      ? 'border-red-500 bg-red-50 text-red-500' 
                      : 'border-gray-300 text-gray-600 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
                  }`}
                >
                  <Heart size={18} className="sm:w-5 sm:h-5" fill={isWishlisted ? "currentColor" : "none"} />
                </button>
              </div>
            </div>

            {/* Trust Badges - Responsive Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
              <div className="flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                <Truck className="text-orange-500" size={20} className="sm:w-6 sm:h-6" />
                <span className="text-[10px] sm:text-xs font-medium text-gray-600 leading-tight">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                <ShieldCheck className="text-orange-500" size={20} className="sm:w-6 sm:h-6" />
                <span className="text-[10px] sm:text-xs font-medium text-gray-600 leading-tight">1 Year Warranty</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                <RefreshCw className="text-orange-500" size={20} className="sm:w-6 sm:h-6" />
                <span className="text-[10px] sm:text-xs font-medium text-gray-600 leading-tight">7 Days Return</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- TABS SECTION (Description & Reviews) --- */}
        <div id="details-section" className="mt-10 sm:mt-16 lg:mt-20">
          {/* Tabs - Scrollable on Mobile */}
          <div className="flex border-b border-gray-200 mb-6 sm:mb-8 overflow-x-auto scrollbar-hide">
            {['description', 'reviews', 'specifications'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-8 py-3 sm:py-4 font-bold text-xs sm:text-sm uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab 
                  ? 'border-orange-600 text-orange-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-100">
            {activeTab === 'description' && (
              <div className="prose max-w-none text-gray-600">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Product Description</h3>
                <p className="whitespace-pre-line leading-relaxed text-sm sm:text-base">{product.description}</p>
              </div>
            )}
            
            {activeTab === 'specifications' && (
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                    <span className="text-gray-500 font-medium text-sm sm:text-base">Brand</span>
                    <span className="text-gray-900 text-sm sm:text-base">{product.brand}</span>
                  </div>
                  <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                    <span className="text-gray-500 font-medium text-sm sm:text-base">Model</span>
                    <span className="text-gray-900 text-sm sm:text-base">{product.slug}</span>
                  </div>
                  <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                    <span className="text-gray-500 font-medium text-sm sm:text-base">Warranty</span>
                    <span className="text-gray-900 text-sm sm:text-base">12 Months Official</span>
                  </div>
                  <div className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                    <span className="text-gray-500 font-medium text-sm sm:text-base">Stock</span>
                    <span className="text-gray-900 text-sm sm:text-base">{product.stock} Units</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-8 sm:py-10 text-gray-500">
                <div className="mb-4">
                  <Star size={40} className="mx-auto text-gray-300 sm:w-12 sm:h-12" />
                </div>
                <p className="text-sm sm:text-base mb-4">No reviews yet for this product.</p>
                <button className="mt-2 text-orange-600 font-medium hover:underline text-sm sm:text-base">Write a Review</button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// --- Loading Skeleton Component ---
function ProductSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 animate-pulse">
      <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/2 sm:w-1/4 mb-6 sm:mb-10"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
        {/* Image Skeleton */}
        <div className="space-y-3 sm:space-y-4">
          <div className="h-[300px] sm:h-[400px] md:h-[500px] bg-gray-200 rounded-xl sm:rounded-2xl"></div>
          <div className="flex gap-2 sm:gap-4">
            {[1,2,3].map(i => <div key={i} className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg"></div>)}
          </div>
        </div>
        
        {/* Info Skeleton */}
        <div className="space-y-4 sm:space-y-6">
          <div className="h-4 sm:h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 sm:h-12 bg-gray-200 rounded w-3/4"></div>
          <div className="h-16 sm:h-20 bg-gray-200 rounded w-full"></div>
          <div className="h-10 sm:h-12 bg-gray-200 rounded w-1/2"></div>
          <div className="flex gap-3">
            <div className="flex-1 h-12 sm:h-14 bg-gray-200 rounded-full"></div>
            <div className="w-12 sm:w-14 h-12 sm:h-14 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}