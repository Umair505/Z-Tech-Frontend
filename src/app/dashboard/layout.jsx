'use client'
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  PlusCircle, 
  Package, 
  LogOut, 
  Bell, 
  Menu,
  X,
  ChevronRight,
  User
} from 'lucide-react';
import { useState } from 'react';
import useAuth from '@/hooks/useAuth';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { user, logOut } = useAuth();

  // Requested Routes
  const navigation = [
    { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/dashboard/users', icon: Users },
    { name: 'Add Products', href: '/dashboard/add-product', icon: PlusCircle },
    { name: 'Products', href: '/dashboard/products', icon: Package },
    { name: 'Order', href: '/dashboard/orders', icon: ShoppingBag },
  ];

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed');
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <Link href="/">
        {/* Brand Logo */}
        <div className="h-20 flex items-center px-8 border-b border-gray-100">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-br-lg rounded-tl-lg flex items-center justify-center text-white font-bold text-xl mr-3 shadow-lg shadow-orange-500/20">
                Z
            </div>
            <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-gray-900 leading-none">Z-TECH</span>
                <span className="text-[10px] text-gray-500 font-medium tracking-widest uppercase mt-1">Administrator</span>
            </div>
            <button className="lg:hidden ml-auto text-gray-500" onClick={() => setSidebarOpen(false)}>
                <X size={24} />
            </button>
        </div>
        </Link>

        {/* Navigation */}
        <div className="p-6 space-y-8 overflow-y-auto h-[calc(100vh-80px)]">
            <div>
                <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Main Menu</p>
                <nav className="space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                    <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent ${
                        isActive 
                            ? 'bg-orange-50 text-orange-600 border-orange-100' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon size={18} className={`${isActive ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-600'} transition-colors`} />
                            {item.name}
                        </div>
                        {isActive && <ChevronRight size={14} className="text-orange-600" />}
                    </Link>
                    );
                })}
                </nav>
            </div>

            {/* Bottom Actions */}
            <div>
                <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Account</p>
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </div>
      </aside>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button className="lg:hidden text-gray-500 hover:text-gray-700" onClick={() => setSidebarOpen(true)}>
                    <Menu size={24} />
                </button>
                <h2 className="text-gray-500 text-sm hidden sm:block">Overview / <span className="text-gray-900 font-medium capitalize">{pathname.split('/').pop() || 'Home'}</span></h2>
            </div>

            <div className="flex items-center gap-6">
                
                <button className="relative text-gray-500 hover:text-gray-700 transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                </button>
                
                {/* Admin Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-gray-900">{user?.displayName || 'Admin'}</p>
                        <p className="text-xs text-gray-500">{user?.email || 'admin@ztech.com'}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-200 ring-2 ring-gray-50 relative">
                        {user?.photoURL ? (
                            <Image 
                                src={user.photoURL} 
                                alt="Profile" 
                                fill 
                                className="object-cover"
                            />
                        ) : (
                            <div className="h-full w-full bg-orange-100 flex items-center justify-center text-orange-600">
                                <User size={20} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto bg-gray-50">
            {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}