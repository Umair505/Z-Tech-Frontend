'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase.init';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, Mail, Lock } from 'lucide-react'; 
import { toast } from "sonner"; 

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // --- SAVE USER TO MONGODB ---
  const saveUserToDB = async (user) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: user.displayName || 'Unknown',
                email: user.email,
                // Google Login এর সময় photoURL পাঠাবো
                // Manual Login এর সময় এটি null হতে পারে, তাতে সমস্যা নেই (ব্যাকএন্ড হ্যান্ডেল করবে)
                photo: user.photoURL || '' 
            }),
        });
        await response.json();
    } catch (error) {
        console.error("DB Sync Error:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Sync with DB
      await saveUserToDB(result.user);

      toast.success("Login successful!");
      router.push('/'); 

    } catch (err) {
      console.error("Login Error:", err);
      toast.error("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      
      // Google User Object contains photoURL
      await saveUserToDB(result.user);

      toast.success("Logged in with Google!");
      router.push('/');
    } catch (err) {
      console.error(err);
      toast.error("Google login failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F9FAFB] px-4 font-sans text-[#334155]">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-xl overflow-hidden border-none pb-4">
        {/* Header Toggle */}
        <div className="flex justify-center pt-8 pb-6">
          <div className="bg-[#F3F4F6] p-1 rounded-full flex items-center">
            <div className="px-6 py-2 rounded-full bg-white shadow-sm text-sm font-bold text-[#FF7A2F]">
              Login
            </div>
            <Link href="/signup" className="px-6 py-2 rounded-full text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors">
              Register
            </Link>
          </div>
        </div>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-[#94a3b8]" />
                <Input id="email" type="email" placeholder="Email" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            {/* Password */}
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-[#94a3b8]" />
                <Input id="password" type="password" placeholder="Password" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>

            <Button type="submit" className="w-full bg-[#FF7A2F] hover:bg-[#FF8A45] text-white font-bold h-12 rounded-lg mt-2" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Log In'}
            </Button>
          </form>

          {/* Google Button */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#E2E8F0]" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-[#94a3b8]">Or login with</span></div>
          </div>

          <Button variant="outline" className="w-full h-11" onClick={handleGoogleLogin}>
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google
          </Button>
        </CardContent>
        <CardFooter className="justify-center pt-2">
           <p className="text-sm text-[#64748B] font-medium">Don't have an account? <Link href="/signup" className="text-[#FF7A2F] hover:underline font-bold">Register Here</Link></p>
        </CardFooter>
      </Card>
    </div>
  );
}