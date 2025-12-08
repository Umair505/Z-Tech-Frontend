'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// 1. Import Custom Hook
import useAuth from '@/hooks/useAuth';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, User, Mail, Lock, Phone } from 'lucide-react';
import { toast } from "sonner";

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 2. Destructure functions from useAuth
  const { createUser, updateUserProfile } = useAuth();

  // --- SAVE USER TO MONGODB ---
  const saveUserToDB = async (firebaseUser) => {
    try {
      const userInfo = {
        name: name,
        email: firebaseUser.email,
        phone: phone, // ফোন নম্বর এখান থেকে ডাটাবেসে যাবে
        photo: firebaseUser.photoURL || '',
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo)
      });

      if (!response.ok) {
         throw new Error('Failed to save user to database');
      }
      
      const data = await response.json();
      console.log("DB Save Success:", data);

    } catch (error) {
      console.error("DB Sync Error:", error);
      toast.error("Account created, but failed to save details to database.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Create User in Firebase
      const result = await createUser(email, password);
      
      // Step 2: Update Firebase Profile (Display Name)
      // Note: Firebase doesn't handle Phone nicely in basic profile, so we only send Name & Photo here
      await updateUserProfile(name, "https://i.ibb.co.com/M6hPdDv/avatar-icon-images-4.jpg"); // ডিফল্ট ফটো দিলাম

      // Step 3: Sync to MongoDB (With Phone Number)
      await saveUserToDB(result.user);

      toast.success("Account created successfully!");
      
      // যেহেতু Firebase সাইনআপ করলে অটো লগিন হয়ে যায়, তাই সরাসরি হোমপেজে পাঠাচ্ছি
      router.push('/'); 

    } catch (error) {
      console.error("Signup Error:", error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error("This email is already registered.");
      } else if (error.code === 'auth/weak-password') {
        toast.error("Password should be at least 6 characters.");
      } else {
        toast.error(error.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F9FAFB] px-4 font-sans text-[#334155]">
      <Card className="w-full max-w-md bg-white shadow-xl rounded-xl overflow-hidden border-none pb-4">
        
        {/* Header Toggle */}
        <div className="flex justify-center pt-8 pb-6">
          <div className="bg-[#F3F4F6] p-1 rounded-full flex items-center">
            <Link href="/login" className="px-6 py-2 rounded-full text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors">
              Login
            </Link>
            <div className="px-6 py-2 rounded-full bg-white shadow-sm text-sm font-bold text-[#FF7A2F]">
              Register
            </div>
          </div>
        </div>

        <CardContent>
          <form onSubmit={handleSignup} className="space-y-5">

            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-[#94a3b8]" />
              <Input 
                placeholder="Full Name"
                className="pl-10 h-11 bg-white border-[#E2E8F0] text-[#0F172A] placeholder:text-[#94a3b8] focus-visible:ring-[#FF7A2F]"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-[#94a3b8]" />
              <Input 
                type="email"
                placeholder="Email Address"
                className="pl-10 h-11 bg-white border-[#E2E8F0] text-[#0F172A] placeholder:text-[#94a3b8] focus-visible:ring-[#FF7A2F]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-[#94a3b8]" />
              <Input 
                type="tel"
                placeholder="Phone Number"
                className="pl-10 h-11 bg-white border-[#E2E8F0] text-[#0F172A] placeholder:text-[#94a3b8] focus-visible:ring-[#FF7A2F]"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-[#94a3b8]" />
              <Input 
                type="password"
                placeholder="Password"
                className="pl-10 h-11 bg-white border-[#E2E8F0] text-[#0F172A] placeholder:text-[#94a3b8] focus-visible:ring-[#FF7A2F]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button 
              type="submit"
              className="w-full bg-[#FF7A2F] hover:bg-[#FF8A45] text-white font-bold h-12 rounded-lg shadow-md"
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign Up"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-[#64748B]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#FF7A2F] hover:underline font-bold">
              Login Here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}