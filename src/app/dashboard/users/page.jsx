import { Search, Filter, MoreVertical, Shield, User as UserIcon } from 'lucide-react';

export default function UsersPage() {
  const users = [
    { id: 1, name: 'Alex Johnson', email: 'alex@example.com', role: 'Admin', status: 'Active', joined: 'Oct 24, 2023' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', role: 'User', status: 'Active', joined: 'Nov 02, 2023' },
    { id: 3, name: 'Michael Brown', email: 'mike@tech.com', role: 'User', status: 'Inactive', joined: 'Dec 15, 2023' },
    { id: 4, name: 'Emily Davis', email: 'emily@design.io', role: 'Moderator', status: 'Active', joined: 'Jan 05, 2024' },
    { id: 5, name: 'James Wilson', email: 'james@corp.net', role: 'User', status: 'Active', joined: 'Jan 20, 2024' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-zinc-400 text-sm">Manage user access and roles.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
             <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input 
                    type="text" 
                    placeholder="Search users..." 
                    className="w-full bg-[#121214] border border-zinc-800 text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:border-orange-500 focus:outline-none"
                />
             </div>
             <button className="p-2.5 bg-[#121214] border border-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:border-zinc-700">
                <Filter size={18} />
             </button>
        </div>
      </div>

      <div className="bg-[#121214] border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400">
                <thead className="bg-zinc-900/50 uppercase text-xs font-medium text-zinc-500">
                    <tr>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Joined Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-zinc-900/30 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                        <UserIcon size={14} className="text-zinc-400" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{user.name}</p>
                                        <p className="text-xs text-zinc-500">{user.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
                                    user.role === 'Admin' 
                                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                                }`}>
                                    {user.role === 'Admin' && <Shield size={10} />}
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    user.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    {user.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs">{user.joined}</td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-zinc-500 hover:text-white transition-colors">
                                    <MoreVertical size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}