'use client' // ১. হুক ব্যবহারের জন্য এটি বাধ্যতামূলক

import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from './useAxiosSecure'
import useAuth from './useAuth';

const useRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  console.log(user);
  const { data: role, isLoading: isRoleLoading } = useQuery({
    queryKey: ['role', user?.email],
    
    // ২. যতক্ষণ ইউজার লোড হচ্ছে বা ইউজার নেই, ততক্ষণ এই কুয়েরি বন্ধ থাকবে
    enabled: !loading && !!user?.email, 
    
    queryFn: async () => {
      // ৩. axiosSecure সরাসরি কল না করে .get() মেথড ব্যবহার করা ভালো
      const { data } = await axiosSecure.get(`/user/role/${user?.email}`)
      return data
    },
  })
  
  // ৪. যদি ইউজার লোডিং থাকে, তাহলে আমরাও লোডিং রিটার্ন করব
  if (loading) {
      return [null, true];
  }

  return [role?.role, isRoleLoading]
}

export default useRole;