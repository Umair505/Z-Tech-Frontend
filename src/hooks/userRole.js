'use client'

import { useQuery } from '@tanstack/react-query'
import useAuth from '@/hooks/useAuth'        // Using absolute path
import useAxiosSecure from '@/hooks/useAxiosSecure' // Using absolute path

const useRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  console.log(user)

  const { data: role, isLoading: isRoleLoading } = useQuery({
    queryKey: ['role', user?.email],
    // Query will ONLY run if auth is done loading AND user exists
    enabled: !authLoading && !!user?.email,
    
    queryFn: async () => {
      // console.log("🔍 Checking role for:", user.email);
      
      // Make sure this matches your backend route exactly!
      // If backend is app.get('/user/role/:email'), use this:
      const { data } = await axiosSecure.get(`/user/role/${user?.email}`);
      return data.role;
    },
    // Optional: Keep previous data while fetching new to prevent flickering
    placeholderData: null, 
  });

  // Combine loading states
  // If Auth is loading OR Role is fetching, return true for loading
  if (authLoading || isRoleLoading) {
    return [null, true];
  }

  // If user is not logged in, return null role and false loading
  if (!user) {
    return [null, false];
  }

  return [role, false];
}

export default useRole;