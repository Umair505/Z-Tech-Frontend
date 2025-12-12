'use client'
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import { Search, Filter, Shield, User as UserIcon, Trash2, ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function UsersPage() {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Fetch Users
  const { data: users = [], refetch, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/users');
      return res.data;
    }
  });

  // Filter Logic
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Make Admin Handler
  const handleMakeAdmin = async (user) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to make ${user.name} an Admin?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ea580c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Make Admin!',
      customClass: {
        popup: 'swal-mobile-responsive',
        title: 'swal-title-mobile',
        htmlContainer: 'swal-text-mobile',
        confirmButton: 'swal-button-mobile',
        cancelButton: 'swal-button-mobile'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.patch(`/users/admin/${user._id}`);
          if(res.data.modifiedCount > 0){
            toast.success(`${user.name} is now an Admin!`);
            refetch();
          }
        } catch (error) {
          console.error(error);
          toast.error("Failed to update role");
        }
      }
    });
  };

  // 3. Delete User Handler
  const handleDeleteUser = async (user) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33', 
        cancelButtonColor: '#374151',
        confirmButtonText: 'Yes, delete it!',
        customClass: {
          popup: 'swal-mobile-responsive',
          title: 'swal-title-mobile',
          htmlContainer: 'swal-text-mobile',
          confirmButton: 'swal-button-mobile',
          cancelButton: 'swal-button-mobile'
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await axiosSecure.delete(`/users/${user._id}`);
                if(res.data.deletedCount > 0){
                    Swal.fire({
                        title: 'Deleted!',
                        text: `${user.name} has been deleted.`,
                        icon: 'success',
                        customClass: {
                          popup: 'swal-mobile-responsive',
                          title: 'swal-title-mobile',
                          htmlContainer: 'swal-text-mobile'
                        }
                    });
                    refetch();
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to delete user");
            }
        }
    });
  };

  return (
    <>
      <style jsx global>{`
        @media (max-width: 640px) {
          .swal-mobile-responsive {
            width: 90% !important;
            max-width: 340px !important;
            padding: 1.5rem !important;
          }
          
          .swal-title-mobile {
            font-size: 1.125rem !important;
            padding: 0 0 0.75rem 0 !important;
          }
          
          .swal-text-mobile {
            font-size: 0.875rem !important;
            padding: 0 !important;
          }
          
          .swal-button-mobile {
            font-size: 0.875rem !important;
            padding: 0.625rem 1.25rem !important;
            min-width: auto !important;
          }
          
          .swal2-icon {
            width: 3.5rem !important;
            height: 3.5rem !important;
            margin: 0.5rem auto 1rem !important;
          }
          
          .swal2-actions {
            gap: 0.5rem !important;
            margin-top: 1.25rem !important;
          }
        }
      `}</style>
      
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-0">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Manage user access and roles.</p>
        </div>
        
        <div className="flex gap-2 sm:gap-3">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search users..." 
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
      {!isLoading && filteredUsers.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
          <UserIcon size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No users found.</p>
        </div>
      )}

      {!isLoading && filteredUsers.length > 0 && (
        <>
          {/* Desktop Table View (md and up) */}
          <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 uppercase text-xs font-semibold text-gray-500 border-b border-gray-200">
                  <tr>
                    <th className="px-4 lg:px-6 py-4">User</th>
                    <th className="px-4 lg:px-6 py-4">Role</th>
                    <th className="px-4 lg:px-6 py-4">Joined Date</th>
                    <th className="px-4 lg:px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden relative shrink-0">
                            {user.photo ? (
                              <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              <UserIcon size={16} className="text-gray-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-gray-900 font-medium truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
                          user.role === 'admin' 
                          ? 'bg-purple-50 text-purple-700 border-purple-200' 
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                          {user.role === 'admin' ? <ShieldCheck size={12} /> : <UserIcon size={12} />}
                          {user.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 font-mono text-xs text-gray-500">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {user.role !== 'admin' && (
                            <button 
                              onClick={() => handleMakeAdmin(user)}
                              className="bg-orange-50 text-orange-600 p-2 rounded-lg hover:bg-orange-100 transition-colors"
                              title="Make Admin"
                            >
                              <ShieldCheck size={18} />
                            </button>
                          )}
                          
                          <button 
                            onClick={() => handleDeleteUser(user)}
                            className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredUsers.map((user) => (
              <div key={user._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                {/* User Info */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden relative shrink-0">
                    {user.photo ? (
                      <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon size={20} className="text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-gray-900 font-semibold text-sm line-clamp-1">{user.name}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border shrink-0 ${
                        user.role === 'admin' 
                        ? 'bg-purple-50 text-purple-700 border-purple-200' 
                        : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}>
                        {user.role === 'admin' ? <ShieldCheck size={10} /> : <UserIcon size={10} />}
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-500 mb-2 line-clamp-1">{user.email}</p>
                    
                    <p className="text-[10px] text-gray-400 font-mono">
                      Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  {user.role !== 'admin' && (
                    <button 
                      onClick={() => handleMakeAdmin(user)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-xs font-medium"
                    >
                      <ShieldCheck size={14} />
                      <span>Make Admin</span>
                    </button>
                  )}
                  
                  <button 
                    onClick={() => handleDeleteUser(user)}
                    className={`flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-medium ${
                      user.role !== 'admin' ? 'flex-1' : 'w-full'
                    }`}
                  >
                    <Trash2 size={14} />
                    <span>Delete User</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
    </>
  );
}