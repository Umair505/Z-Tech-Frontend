'use client';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import useAuth from '@/hooks/useAuth';
import { Package, Clock, CheckCircle, Truck, XCircle, ChevronRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function UserProfilePage() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch User Orders
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['my-orders', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get('/orders');
      return res.data;
    }
  });

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
        case 'delivered': return <CheckCircle className="text-green-500" size={18} />;
        case 'shipped': return <Truck className="text-blue-500" size={18} />;
        case 'cancelled': return <XCircle className="text-red-500" size={18} />;
        default: return <Clock className="text-yellow-500" size={18} />;
    }
  };

  const getStatusStyle = (status) => {
    switch(status?.toLowerCase()) {
        case 'delivered': return 'bg-green-50 text-green-700 border-green-200';
        case 'shipped': return 'bg-blue-50 text-blue-700 border-blue-200';
        case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
        default: return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8 flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden relative bg-gray-100">
                {user?.photoURL ? (
                    <Image src={user.photoURL} alt="Profile" fill className="object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl font-bold">
                        {user?.displayName?.charAt(0) || 'U'}
                    </div>
                )}
            </div>
            <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold text-gray-900">{user?.displayName}</h1>
                <p className="text-gray-500">{user?.email}</p>
                <div className="mt-4 flex gap-4 justify-center md:justify-start text-sm">
                    <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-lg font-medium border border-orange-100">
                        {orders.length} Orders Placed
                    </div>
                </div>
            </div>
        </div>

        {/* Orders Section */}
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag className="text-orange-600" /> Order History
            </h2>

            {isLoading ? (
                <div className="text-center py-20 text-gray-500">Loading your orders...</div>
            ) : orders.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-gray-200 shadow-sm">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No orders yet</h3>
                    <p className="text-gray-500 mb-6">Looks like you haven't made any purchases yet.</p>
                    <Link href="/products" className="px-6 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            {/* Order Header */}
                            <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Order ID</p>
                                    <p className="text-sm font-mono font-bold text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Date Placed</p>
                                    <p className="text-sm text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Total Amount</p>
                                    <p className="text-sm font-bold text-orange-600">৳{order.totalAmount?.toLocaleString()}</p>
                                </div>
                                <div className="flex items-center">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border capitalize ${getStatusStyle(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items Preview */}
                            <div className="p-4 sm:p-6">
                                <div className="space-y-4">
                                    {order.products.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4">
                                            <div className="h-16 w-16 bg-gray-50 rounded-lg border border-gray-100 relative overflow-hidden shrink-0">
                                                {item.image ? (
                                                    <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">No Img</div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</h4>
                                                <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} × ৳{item.price?.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer Actions (Optional: View Details Link if you create a user-facing order details page) */}
                                {/* <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                                    <Link href={`/profile/orders/${order._id}`} className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1">
                                        View Order Details <ChevronRight size={16} />
                                    </Link>
                                </div> 
                                */}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

      </div>
    </div>
  );
}