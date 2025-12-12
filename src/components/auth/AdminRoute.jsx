'use client';
import useRole from "@/hooks/userRole";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const [role, roleLoading] = useRole();
  const router = useRouter();

  useEffect(() => {
    // Wait until auth and role loading is done
    if (!loading && !roleLoading) {
      // If user is not logged in or role is not admin, redirect
      if (!user || role !== 'admin') {
        router.push('/'); // Redirect to home or /login
      }
    }
  }, [user, role, loading, roleLoading, router]);

  // Show loading spinner while checking
  if (loading || roleLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-orange-600" size={40} />
      </div>
    );
  }

  // If user is admin, render the dashboard content
  if (user && role === 'admin') {
    return children;
  }

  return null; // Return null while redirecting
}