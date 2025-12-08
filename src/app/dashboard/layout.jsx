'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  PlusCircle, 
  Package, 
  LogOut, 
  Search, 
  Bell, 
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Requested Routes
  const navigation = [
    { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/dashboard/users', icon: Users },
    { name: 'Add Products', href: '/dashboard/add-product', icon: PlusCircle },
    { name: 'Products', href: '/dashboard/products', icon: Package },
    { name: 'Order', href: '/dashboard/orders', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex font-sans selection:bg-orange-500/30">
      
      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0c0c0e] border-r border-zinc-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <Link href="/">
        {/* Brand Logo */}
        <div className="h-20 flex items-center px-8 border-b border-zinc-800/50">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3 shadow-lg shadow-orange-500/20">
                Z
            </div>
            <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white leading-none">Z-TECH</span>
                <span className="text-[10px] text-zinc-500 font-medium tracking-widest uppercase mt-1">Administrator</span>
            </div>
            <button className="lg:hidden ml-auto text-zinc-400" onClick={() => setSidebarOpen(false)}>
                <X size={24} />
            </button>
        </div>
        </Link>

        {/* Navigation */}
        <div className="p-6 space-y-8 overflow-y-auto h-[calc(100vh-80px)]">
            <div>
                <p className="px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Main Menu</p>
                <nav className="space-y-2">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                    <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent ${
                        isActive 
                            ? 'bg-zinc-900 text-white border-zinc-800 shadow-inner' 
                            : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon size={18} className={`${isActive ? 'text-orange-500' : 'text-zinc-500 group-hover:text-zinc-300'} transition-colors`} />
                            {item.name}
                        </div>
                        {isActive && <ChevronRight size={14} className="text-orange-500" />}
                    </Link>
                    );
                })}
                </nav>
            </div>

            {/* Bottom Actions */}
            <div>
                <p className="px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Account</p>
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-colors">
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </div>
      </aside>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="h-20 bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800/50 sticky top-0 z-40 px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button className="lg:hidden text-zinc-400 hover:text-white" onClick={() => setSidebarOpen(true)}>
                    <Menu size={24} />
                </button>
                <h2 className="text-zinc-400 text-sm hidden sm:block">Overview / <span className="text-white font-medium capitalize">{pathname.split('/').pop() || 'Home'}</span></h2>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center bg-[#18181b] border border-zinc-800 rounded-full px-4 py-2 w-64 focus-within:border-orange-500/50 transition-colors">
                    <Search size={16} className="text-zinc-500 mr-3" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="bg-transparent border-none outline-none text-sm text-zinc-200 w-full placeholder:text-zinc-600"
                    />
                </div>
                <button className="relative text-zinc-400 hover:text-white transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-[#09090b]"></span>
                </button>
                <div className="w-9 h-9 bg-gradient-to-tr from-zinc-700 to-zinc-600 rounded-full border border-zinc-500 ring-2 ring-zinc-900 cursor-pointer"></div>
            </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
            {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}