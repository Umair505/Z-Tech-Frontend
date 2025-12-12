'use client'
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import { Eye, Download, Search, Filter, ChevronDown, Package, User, Calendar, CreditCard, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function OrdersPage() {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Fetch Orders
  const { data: orders = [], refetch, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/orders');
      return res.data;
    }
  });

  // Filter Logic
  const filteredOrders = orders.filter(order =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Status Update Handler
  const handleStatusChange = async (id, newStatus) => {
    try {
        const res = await axiosSecure.patch(`/admin/orders/${id}`, { status: newStatus });
        if(res.data.modifiedCount > 0) {
            toast.success(`Order marked as ${newStatus}`);
            refetch();
        }
    } catch (error) {
        console.error("Status update error:", error);
        toast.error("Failed to update status");
    }
  };

  const handleDownloadInvoice = (id) => {
      toast.success("Redirecting to invoice view...");
      window.location.href = `/dashboard/orders/${id}`;
  };

  // Helper for Status Badge Styles
  const getStatusColor = (status) => {
      switch(status?.toLowerCase()) {
          case 'completed': 
          case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
          case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
          case 'processing': 
          case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
          case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
          default: return 'bg-gray-100 text-gray-700 border-gray-200';
      }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-0">
      {/* Header & Search */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Track and manage customer orders.</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search orders..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
            />
          </div>
          <button className="p-2.5 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shrink-0">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-orange-600" size={40} />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredOrders.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No orders found.</p>
        </div>
      )}

      {!isLoading && filteredOrders.length > 0 && (
        <>
          {/* Desktop Table View (lg and up) */}
          <div className="hidden lg:block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 uppercase text-xs font-semibold text-gray-500 border-b border-gray-200">
                  <tr>
                    <th className="px-4 xl:px-6 py-4">Order ID</th>
                    <th className="px-4 xl:px-6 py-4">Customer</th>
                    <th className="px-4 xl:px-6 py-4">Date</th>
                    <th className="px-4 xl:px-6 py-4">Items</th>
                    <th className="px-4 xl:px-6 py-4">Total</th>
                    <th className="px-4 xl:px-6 py-4">Payment</th>
                    <th className="px-4 xl:px-6 py-4">Status</th>
                    <th className="px-4 xl:px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 xl:px-6 py-4 font-mono text-xs font-medium text-gray-500">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-4 xl:px-6 py-4">
                        <p className="font-medium text-gray-900 text-sm">{order.customer?.name}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[150px]">{order.customer?.email}</p>
                      </td>
                      <td className="px-4 xl:px-6 py-4 text-xs">
                        {new Date(order.createdAt).toLocaleDateString()}
                        <br />
                        <span className="text-gray-400">{new Date(order.createdAt).toLocaleTimeString()}</span>
                      </td>
                      <td className="px-4 xl:px-6 py-4 text-sm">
                        {order.products?.length || 0} items
                      </td>
                      <td className="px-4 xl:px-6 py-4 font-bold text-gray-900">
                        ৳{order.totalAmount?.toLocaleString()}
                      </td>
                      <td className="px-4 xl:px-6 py-4">
                        <span className="uppercase text-xs font-bold text-gray-600 border border-gray-200 px-2 py-1 rounded bg-gray-50 whitespace-nowrap">
                          {order.payment?.method || 'COD'}
                        </span>
                      </td>
                      <td className="px-4 xl:px-6 py-4">
                        <div className="relative group w-32">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className={`appearance-none cursor-pointer w-full pl-3 pr-8 py-1.5 rounded-full text-xs font-bold border focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-500 ${getStatusColor(order.status)}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                        </div>
                      </td>
                      <td className="px-4 xl:px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/dashboard/orders/${order._id}`}>
                            <button className="text-gray-400 hover:text-orange-600 p-1.5 rounded-md hover:bg-orange-50 transition-colors" title="View Details">
                              <Eye size={18} />
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleDownloadInvoice(order._id)}
                            className="text-gray-400 hover:text-blue-600 p-1.5 rounded-md hover:bg-blue-50 transition-colors" 
                            title="Download Invoice"
                          >
                            <Download size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden space-y-3">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                
                {/* Header: Order ID & Status */}
                <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-100">
                  <div>
                    <p className="font-mono text-xs font-medium text-gray-500 mb-1">
                      #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <User size={14} className="text-gray-400" />
                    <p className="font-semibold text-gray-900 text-sm">{order.customer?.name}</p>
                  </div>
                  <p className="text-xs text-gray-500 ml-6 truncate">{order.customer?.email}</p>
                </div>

                {/* Order Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-gray-100">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase mb-0.5">Items</p>
                    <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                      <Package size={12} className="text-gray-400" />
                      {order.products?.length || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase mb-0.5">Payment</p>
                    <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                      <CreditCard size={12} className="text-gray-400" />
                      {order.payment?.method || 'COD'}
                    </p>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Total Amount</span>
                  <span className="text-lg font-bold text-orange-600">৳{order.totalAmount?.toLocaleString()}</span>
                </div>

                {/* Status Selector & Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  {/* Status Dropdown */}
                  <div className="relative flex-1">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`appearance-none cursor-pointer w-full pl-3 pr-8 py-2.5 rounded-lg text-xs font-bold border focus:outline-none focus:ring-2 focus:ring-orange-500 ${getStatusColor(order.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link href={`/dashboard/orders/${order._id}`} className="flex-1 sm:flex-none">
                      <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-xs font-medium">
                        <Eye size={14} />
                        <span>View</span>
                      </button>
                    </Link>
                    <button 
                      onClick={() => handleDownloadInvoice(order._id)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium"
                    >
                      <Download size={14} />
                      <span>Invoice</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}