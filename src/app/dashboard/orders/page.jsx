import { Eye, Download, Search, Filter } from 'lucide-react';

export default function OrdersPage() {
  const orders = [
    { id: '#ORD-001', customer: 'John Doe', date: 'Oct 24, 2024', total: '$299.99', status: 'Completed', items: 2 },
    { id: '#ORD-002', customer: 'Jane Smith', date: 'Oct 25, 2024', total: '$45.00', status: 'Pending', items: 1 },
    { id: '#ORD-003', customer: 'Mike Johnson', date: 'Oct 26, 2024', total: '$1,200.00', status: 'Processing', items: 4 },
    { id: '#ORD-004', customer: 'Sarah Connor', date: 'Oct 27, 2024', total: '$199.50', status: 'Cancelled', items: 1 },
  ];

  const getStatusColor = (status) => {
      switch(status) {
          case 'Completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
          case 'Pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
          case 'Processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
          case 'Cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
          default: return 'bg-zinc-800 text-zinc-400';
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-zinc-400 text-sm">Track and manage customer orders.</p>
        </div>
        <div className="flex gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input type="text" placeholder="Search orders..." className="bg-[#121214] border border-zinc-800 text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:border-orange-500 focus:outline-none" />
             </div>
             <button className="p-2.5 bg-[#121214] border border-zinc-800 rounded-lg text-zinc-400 hover:text-white">
                <Filter size={18} />
             </button>
        </div>
      </div>

      <div className="bg-[#121214] border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-900/50 uppercase text-xs font-medium text-zinc-500">
                <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Items</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
                {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-6 py-4 font-mono text-white">{order.id}</td>
                        <td className="px-6 py-4">{order.customer}</td>
                        <td className="px-6 py-4">{order.date}</td>
                        <td className="px-6 py-4">{order.items}</td>
                        <td className="px-6 py-4 font-bold text-white">{order.total}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button className="text-zinc-500 hover:text-orange-500 mr-3 transition-colors" title="View Details">
                                <Eye size={18} />
                            </button>
                            <button className="text-zinc-500 hover:text-white transition-colors" title="Download Invoice">
                                <Download size={18} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}