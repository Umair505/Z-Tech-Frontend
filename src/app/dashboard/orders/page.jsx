'use client'
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import { Eye, Download, Search, Filter, ChevronDown } from 'lucide-react';
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
            refetch(); // Refresh data to reflect changes
        }
    } catch (error) {
        console.error("Status update error:", error);
        toast.error("Failed to update status");
    }
  };

  const handleDownloadInvoice = (id) => {
      // In a real app, this would trigger a PDF download. 
      // For now, we'll redirect to the details page which has a print button.
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
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 text-sm">Track and manage customer orders.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
             <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Search ID, Name or Email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                />
             </div>
             <button className="p-2.5 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                <Filter size={18} />
             </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 min-w-[1000px]">
                <thead className="bg-gray-50 uppercase text-xs font-semibold text-gray-500 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Items</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Payment</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                         <tr><td colSpan="8" className="p-8 text-center text-gray-500">Loading orders...</td></tr>
                    ) : filteredOrders.length === 0 ? (
                         <tr><td colSpan="8" className="p-8 text-center text-gray-500">No orders found.</td></tr>
                    ) : (
                    filteredOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                            {/* Order ID */}
                            <td className="px-6 py-4 font-mono text-xs font-medium text-gray-500">
                                #{order._id.slice(-6).toUpperCase()}
                            </td>

                            {/* Customer Info */}
                            <td className="px-6 py-4">
                                <p className="font-medium text-gray-900">{order.customer?.name}</p>
                                <p className="text-xs text-gray-500">{order.customer?.email}</p>
                            </td>

                            {/* Date */}
                            <td className="px-6 py-4 text-xs">
                                {new Date(order.createdAt).toLocaleDateString()}
                                <br />
                                <span className="text-gray-400">{new Date(order.createdAt).toLocaleTimeString()}</span>
                            </td>

                            {/* Items Count */}
                            <td className="px-6 py-4">
                                {order.products?.length || 0} items
                            </td>

                            {/* Total Amount */}
                            <td className="px-6 py-4 font-bold text-gray-900">
                                ৳{order.totalAmount?.toLocaleString()}
                            </td>

                            {/* Payment Method */}
                            <td className="px-6 py-4">
                                <span className="uppercase text-xs font-bold text-gray-600 border border-gray-200 px-2 py-1 rounded bg-gray-50">
                                    {order.payment?.method || 'COD'}
                                </span>
                            </td>

                            {/* Status Dropdown */}
                            <td className="px-6 py-4">
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

                            {/* Actions */}
                            <td className="px-6 py-4 text-right">
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
                    )))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}