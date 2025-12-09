'use client';
import Link from 'next/link';
import { ShoppingCart, Eye, Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { _id, name, price, category, images, status, isNewArrival } = product;

  return (
    <div className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
      
      {/* Badge */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {isNewArrival && (
          <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
            New
          </span>
        )}
        {status === 'out-of-stock' && (
          <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
            Sold Out
          </span>
        )}
      </div>

      {/* Image Container */}
      <div className="relative h-64 w-full bg-gray-50 overflow-hidden">
        <img
          src={images?.[0] || '/placeholder.png'}
          alt={name}
          className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Hover Actions Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link 
            href={`/products/${_id}`}
            className="p-3 bg-white text-gray-700 rounded-full shadow-lg hover:bg-orange-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300"
            title="View Details"
          >
            <Eye size={20} />
          </Link>
          <button 
            className="p-3 bg-white text-gray-700 rounded-full shadow-lg hover:bg-orange-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
            title="Add to Cart"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <p className="text-xs text-orange-500 font-semibold uppercase tracking-wide mb-1">
          {category}
        </p>
        <Link href={`/products/${_id}`}>
          <h3 className="text-gray-900 font-bold text-lg mb-2 line-clamp-1 hover:text-orange-600 transition-colors">
            {name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-extrabold text-gray-900">
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