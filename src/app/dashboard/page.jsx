import { DollarSign, Users, ShoppingBag, Package, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { label: 'Total Revenue', value: '$84,254', change: '+12.5%', icon: DollarSign, color: 'text-green-500' },
    { label: 'Total Users', value: '2,543', change: '+8.2%', icon: Users, color: 'text-blue-500' },
    { label: 'Total Orders', value: '1,254', change: '+3.1%', icon: ShoppingBag, color: 'text-orange-500' },
    { label: 'Products', value: '52', change: '+0.4%', icon: Package, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-zinc-400 mt-2">Welcome back. Here is your store's performance overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#121214] border border-zinc-800 p-6 rounded-2xl hover:border-zinc-700 transition-colors group">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-zinc-900/50 rounded-xl text-zinc-400 group-hover:bg-zinc-900 transition-colors">
                <stat.icon size={22} className={stat.color} />
              </div>
              <span className="flex items-center text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                {stat.change} <TrendingUp size={12} className="ml-1" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-zinc-500 text-sm font-medium">{stat.label}</h3>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chart Placeholder / Big Card */}
        <div className="lg:col-span-2 bg-[#121214] border border-zinc-800 rounded-2xl p-6 min-h-[300px]">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-white">Revenue Analytics</h3>
             <select className="bg-zinc-900 border border-zinc-800 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none">
               <option>This Week</option>
               <option>This Month</option>
               <option>This Year</option>
             </select>
           </div>
           {/* Visual placeholder for a chart */}
           <div className="h-64 flex items-end justify-between gap-2 px-4">
              {[40, 65, 30, 80, 55, 90, 45, 70, 50, 60, 85, 95].map((h, i) => (
                  <div key={i} className="w-full bg-zinc-800/50 rounded-t-sm hover:bg-orange-600 transition-all duration-500 relative group" style={{ height: `${h}%` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {h}%
                      </div>
                  </div>
              ))}
           </div>
           <div className="flex justify-between mt-4 text-xs text-zinc-500 px-2">
              <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Dec</span>
           </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Recent Sales</h3>
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-center justify-between p-3 hover:bg-zinc-900/50 rounded-xl transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-400">
                                U{item}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">User {item}</p>
                                <p className="text-xs text-zinc-500">CyberBass X1</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-white">+$199.00</p>
                            <p className="text-xs text-zinc-500">2 min ago</p>
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-6 py-3 border border-zinc-800 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                View All Transactions
            </button>
        </div>

      </div>
    </div>
  );
}