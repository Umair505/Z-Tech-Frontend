'use client';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import { DollarSign, Users, ShoppingBag, Package, TrendingUp, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function DashboardPage() {
  const axiosSecure = useAxiosSecure();

  // 1. Fetch Stats
  const { data: stats = {} } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/stats');
      return res.data;
    }
  });

  // 2. Fetch Recent Orders for Table & Chart
  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/orders');
      return res.data;
    }
  });

  // Prepare Chart Data (Group revenue by date)
  const chartData = orders.reduce((acc, order) => {
    const date = new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    const existing = acc.find(item => item.name === date);
    if (existing) {
        existing.revenue += order.totalAmount || 0;
    } else {
        acc.push({ name: date, revenue: order.totalAmount || 0 });
    }
    return acc;
  }, []).slice(0, 7).reverse(); // Last 7 days

  const statCards = [
    { label: 'Total Revenue', value: `৳${stats.revenue?.toLocaleString() || 0}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total Users', value: stats.totalUsers || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Orders', value: stats.totalOrders || 0, icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Products', value: stats.totalProducts || 0, icon: Package, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome back. Here is your store's performance overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-colors`}>
                <stat.icon size={22} />
              </div>
              {/* Optional: Add percentage change logic if backend supports it */}
            </div>
            <div className="mt-4">
              <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics & Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Revenue Analytics Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm min-h-[400px] flex flex-col">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-900">Revenue Analytics</h3>
           </div>
           
           <div className="flex-1 w-full h-[300px]">
             {chartData.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#6B7280', fontSize: 12 }} 
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#6B7280', fontSize: 12 }} 
                            tickFormatter={(value) => `৳${value}`}
                        />
                        <Tooltip 
                            cursor={{ fill: '#F3F4F6' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar 
                            dataKey="revenue" 
                            fill="#ea580c" 
                            radius={[4, 4, 0, 0]} 
                            barSize={40}
                        />
                    </BarChart>
                 </ResponsiveContainer>
             ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    No revenue data available yet.
                </div>
             )}
           </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Sales</h3>
            <div className="space-y-4 flex-1 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
                {orders.length === 0 ? (
                    <p className="text-center text-gray-400 py-10">No recent sales.</p>
                ) : (
                    orders.slice(0, 6).map((order) => (
                        <div key={order._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 uppercase shrink-0">
                                    {order.customer?.name?.slice(0, 2) || 'U'}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{order.customer?.name || 'Unknown'}</p>
                                    <p className="text-xs text-gray-500">{order.products?.length || 0} items</p>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-sm font-bold text-gray-900">৳{order.totalAmount?.toLocaleString()}</p>
                                <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <Link href="/dashboard/orders" className="w-full mt-6 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors text-center block">
                View All Transactions
            </Link>
        </div>

      </div>
    </div>
  );
}