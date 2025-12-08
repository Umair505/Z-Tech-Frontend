import axios from 'axios';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // 1. Changed import
import toast from 'react-hot-toast';
import useAuth from './useAuth';

export const axiosSecure = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  withCredentials: true,
});

const useAxiosSecure = () => {
  const router = useRouter(); // 2. Changed hook initialization
  const { logOut } = useAuth();
  
  useEffect(() => {
    const interceptor = axiosSecure.interceptors.response.use(
      (res) => res,
      async (error) => {
        if (!error.response) {
          // Network error or no response
          toast.error('Network error. Please check your connection.');
          return Promise.reject(error);
        }

        const status = error.response.status; // Extract status
        console.log('Error caught from axios interceptor:', status);
        
        switch (status) {
          case 401:
            // Unauthorized - logout and redirect to login
            await logOut();
            toast.error('Session expired. Please login again.');
            router.push('/login'); // 3. Changed navigate to router.push
            break;
            
          case 403:
            // Forbidden - show message and redirect to dashboard
            toast.error('You do not have permission to perform this action.');
            router.push('/'); // Or dashboard
            break;
            
          case 404:
            // Not found
            // toast.error('The requested resource was not found.'); // Optional: too many toasts can be annoying
            break;
            
          case 500:
            // Server error
            toast.error('Server error. Please try again later.');
            break;
            
          default:
            // Other errors
            // toast.error(`Something went wrong: ${status}`);
        }
        
        return Promise.reject(error);
      }
    );

    // Cleanup: Remove interceptor when component unmounts to prevent duplicates
    return () => {
        axiosSecure.interceptors.response.eject(interceptor);
    }
  }, [logOut, router]);
  
  return axiosSecure;
};

export default useAxiosSecure;