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
  const [actionLoading, setActionLoading] = useState(false); // For button loading state

  // --- Fetch Data ---
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
        setSelectedImage(data.images?.[0] || '');
      } catch (error) {
        console.error("Error:", error);
        // toast.error("Failed to load product details."); 
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // --- Check Wishlist Status ---
  useEffect(() => {
    if (user && id) {
      // Check if item is already in wishlist to set the red heart icon
      // This is optional but good UX. Requires a fetch or check against cached wishlist data.
      // For simplicity, we assume false initially or you can implement a check API.
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
      queryClient.invalidateQueries(['cart']); // Update Navbar Badge
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
      setIsWishlisted(true); // Turn icon red instantly
      queryClient.invalidateQueries(['wishlist']); // Update Navbar Badge
    } catch (error) {
        if(error.response?.data?.message){
            toast.error(error.response.data.message);
            // If already added, maybe we want to show it as added
            if(error.response.data.message === "Already in wishlist") setIsWishlisted(true);
        } else {
            toast.error("Failed to add to wishlist");
        }
    }
  };

  if (loading) return <ProductSkeleton />;
  if (!product) return <div className="text-center py-20 text-gray-500">Product Not Found</div>;

  const isInStock = product.stock > 0;
  const discountPrice = product.price + (product.price * 0.1); 

  return (
    <div className="bg-white min-h-screen font-sans pb-20">
      
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-orange-600">Home</Link>
            <ChevronRight size={14} className="mx-2" />
            <Link href="/products" className="hover:text-orange-600">Products</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* --- LEFT: Image Gallery --- */}
          <div className="space-y-6">
            <div className="relative h-[400px] md:h-[500px] bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden group flex items-center justify-center">
              {product.isNewArrival && (
                <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">NEW</span>
              )}
              {selectedImage ? (
                <img 
                  src={selectedImage} 
                  alt={product.name} 
                  className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-110 cursor-zoom-in" 
                />
              ) : (
                <div className="text-gray-300">No Image</div>
              )}
            </div>

            {product.images?.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all ${selectedImage === img ? 'border-orange-500 ring-2 ring-orange-100' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* --- RIGHT: Product Info --- */}
          <div>
            <div className="mb-2">
              <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">{product.category}</span>
              <span className="text-gray-300 mx-2">|</span>
              <span className="text-gray-500 text-sm">Brand: <span className="text-gray-900 font-medium">{product.brand}</span></span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-yellow-400 text-sm">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <span className="text-sm text-gray-500">(12 Reviews)</span>
              <div className={`flex items-center gap-1 text-sm font-medium ${isInStock ? 'text-green-600' : 'text-red-500'}`}>
                {isInStock ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                {isInStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </div>
            </div>

            <div className="flex items-end gap-3 mb-8 pb-8 border-b border-gray-100">
              <span className="text-4xl font-bold text-orange-600">৳{product.price?.toLocaleString()}</span>
              <span className="text-xl text-gray-400 line-through mb-1">৳{discountPrice.toFixed(0)}</span>
              <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded mb-2">10% OFF</span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">
              {product.description?.substring(0, 200)}...
              <button 
                onClick={() => {
                  setActiveTab('description');
                  document.getElementById('details-section').scrollIntoView({ behavior: 'smooth' });
                }} 
                className="text-orange-600 font-medium ml-1 hover:underline"
              >
                Read more
              </button>
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Quantity */}
              <div className="flex items-center border border-gray-300 rounded-full h-12 w-32">
                <button 
                  onClick={() => handleQuantityChange('dec')}
                  className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-orange-600 transition"
                  disabled={!isInStock}
                >
                  <Minus size={18} />
                </button>
                <div className="flex-1 text-center font-bold text-gray-900">{quantity}</div>
                <button 
                  onClick={() => handleQuantityChange('inc')}
                  className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-orange-600 transition"
                  disabled={!isInStock}
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Add to Cart */}
              <button 
                onClick={handleAddToCart}
                disabled={!isInStock || actionLoading}
                className={`flex-1 h-12 rounded-full font-bold flex items-center justify-center gap-2 shadow-lg transition-all transform active:scale-95 ${
                  isInStock 
                  ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-orange-200' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {actionLoading ? <Loader2 className="animate-spin" size={20}/> : <ShoppingCart size={20} />}
                {isInStock ? 'Add to Cart' : 'Out of Stock'}
              </button>

              {/* Wishlist */}
              <button 
                onClick={handleAddToWishlist}
                className={`h-12 w-12 border rounded-full flex items-center justify-center transition-colors ${
                    isWishlisted 
                    ? 'border-red-500 bg-red-50 text-red-500' 
                    : 'border-gray-300 text-gray-600 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
                }`}
              >
                <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-xl">
                <Truck className="text-orange-500" size={24} />
                <span className="text-xs font-medium text-gray-600">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-xl">
                <ShieldCheck className="text-orange-500" size={24} />
                <span className="text-xs font-medium text-gray-600">1 Year Warranty</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-xl">
                <RefreshCw className="text-orange-500" size={24} />
                <span className="text-xs font-medium text-gray-600">7 Days Return</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- TABS SECTION (Description & Reviews) --- */}
        <div id="details-section" className="mt-20">
          <div className="flex border-b border-gray-200 mb-8">
            {['description', 'reviews', 'specifications'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 font-bold text-sm uppercase tracking-wide border-b-2 transition-colors ${
                  activeTab === tab 
                  ? 'border-orange-600 text-orange-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            {activeTab === 'description' && (
              <div className="prose max-w-none text-gray-600">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Product Description</h3>
                <p className="whitespace-pre-line leading-relaxed">{product.description}</p>
              </div>
            )}
            
            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-500 font-medium">Brand</span>
                    <span className="text-gray-900">{product.brand}</span>
                 </div>
                 <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-500 font-medium">Model</span>
                    <span className="text-gray-900">{product.slug}</span>
                 </div>
                 <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-500 font-medium">Warranty</span>
                    <span className="text-gray-900">12 Months Official</span>
                 </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-10 text-gray-500">
                <p>No reviews yet for this product.</p>
                <button className="mt-4 text-orange-600 font-medium hover:underline">Write a Review</button>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-10"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="h-[500px] bg-gray-200 rounded-2xl"></div>
          <div className="flex gap-4">
            {[1,2,3].map(i => <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>)}
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-12 bg-gray-200 rounded w-3/4"></div>
          <div className="h-20 bg-gray-200 rounded w-full"></div>
          <div className="h-12 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}