'use client'
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import { Search, Filter, Shield, User as UserIcon, Trash2, ShieldCheck, ShieldAlert } from 'lucide-react';
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
      confirmButtonColor: '#ea580c', // Orange-600
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Make Admin!'
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
        confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await axiosSecure.delete(`/users/${user._id}`);
                if(res.data.deletedCount > 0){
                    Swal.fire(
                        'Deleted!',
                        `${user.name} has been deleted.`,
                        'success'
                    );
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 text-sm">Manage user access and roles.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
             <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Search users..." 
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

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 min-w-[800px]">
                <thead className="bg-gray-50 uppercase text-xs font-semibold text-gray-500 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Joined Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                        <tr><td colSpan="4" className="p-8 text-center">Loading users...</td></tr>
                    ) : filteredUsers.length === 0 ? (
                        <tr><td colSpan="4" className="p-8 text-center">No users found.</td></tr>
                    ) : (
                    filteredUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden relative">
                                        {user.photo ? (
                                            <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <UserIcon size={16} className="text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-gray-900 font-medium">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
                                    user.role === 'admin' 
                                    ? 'bg-purple-50 text-purple-700 border-purple-200' 
                                    : 'bg-gray-100 text-gray-600 border-gray-200'
                                }`}>
                                    {user.role === 'admin' ? <ShieldCheck size={12} /> : <UserIcon size={12} />}
                                    {user.role === 'admin' ? 'Admin' : 'User'}
                                </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    {/* Make Admin Button */}
                                    {user.role !== 'admin' && (
                                        <button 
                                            onClick={() => handleMakeAdmin(user)}
                                            className="bg-orange-50 text-orange-600 p-2 rounded-lg hover:bg-orange-100 transition-colors"
                                            title="Make Admin"
                                        >
                                            <ShieldCheck size={18} />
                                        </button>
                                    )}
                                    
                                    {/* Delete User Button */}
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
                    )))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}