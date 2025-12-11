import { DollarSign, Users, ShoppingBag, Package, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { label: 'Total Revenue', value: '$84,254', change: '+12.5%', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total Users', value: '2,543', change: '+8.2%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Orders', value: '1,254', change: '+3.1%', icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Products', value: '52', change: '+0.4%', icon: Package, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome back. Here is your store's performance overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-colors`}>
                <stat.icon size={22} />
              </div>
              <span className="flex items-center text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                {stat.change} <TrendingUp size={12} className="ml-1" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chart Placeholder / Big Card */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm min-h-[300px]">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-900">Revenue Analytics</h3>
             <select className="bg-gray-50 border border-gray-200 text-xs text-gray-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500/20">
               <option>This Week</option>
               <option>This Month</option>
               <option>This Year</option>
             </select>
           </div>
           {/* Visual placeholder for a chart */}
           <div className="h-64 flex items-end justify-between gap-2 px-4">
              {[40, 65, 30, 80, 55, 90, 45, 70, 50, 60, 85, 95].map((h, i) => (
                  <div key={i} className="w-full bg-gray-100 rounded-t-sm hover:bg-orange-500 transition-all duration-300 relative group" style={{ height: `${h}%` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {h}%
                      </div>
                  </div>
              ))}
           </div>
           <div className="flex justify-between mt-4 text-xs text-gray-400 px-2">
              <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Dec</span>
           </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Sales</h3>
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">
                                U{item}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">User {item}</p>
                                <p className="text-xs text-gray-500">CyberBass X1</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">+$199.00</p>
                            <p className="text-xs text-gray-400">2 min ago</p>
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-6 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                View All Transactions
            </button>
        </div>

      </div>
    </div>
  );
}