'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed.");
        setLoading(false);
        return;
      }

      toast.success("Account created successfully! Please log in.");
      router.push('/login');

    } catch (error) {
      console.error("Signup Error:", error);
      toast.error("Something went wrong. Try again.");
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
