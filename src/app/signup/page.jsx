'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase.init'; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, User, Mail, Lock, Phone } from 'lucide-react'; // Added Phone icon
import { toast } from "sonner"; 

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(''); // New State for Phone
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create User
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // 2. Update Profile (Note: Phone number usually requires Firestore or specific Auth setup to save)
      await updateProfile(user, {
        displayName: name
      });

      // 3. Prevent Auto-login
      await auth.signOut();

      // 4. Show Success Toast
      toast.success("Account created successfully! Please log in.");
      
      // 5. Redirect
      router.push('/login'); 
      
    } catch (err) {
      console.error("Signup Error:", err.code, err.message); // Debugging log
      
      let errorMessage = "Something went wrong.";
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = "This email is already registered.";
          break;
        case 'auth/weak-password':
          errorMessage = "Password should be at least 6 characters.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Please enter a valid email address.";
          break;
        default:
          errorMessage = err.message;
      }
      toast.error(errorMessage);
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
            
            {/* Name Input */}
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-[#94a3b8]" />
                <Input 
                  id="name" 
                  placeholder="Full Name" 
                  className="pl-10 bg-white border-[#E2E8F0] text-[#0F172A] h-11 placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#FF7A2F] focus-visible:ring-offset-0 focus-visible:border-[#FF7A2F] rounded-lg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-[#94a3b8]" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Email Address" 
                  className="pl-10 bg-white border-[#E2E8F0] text-[#0F172A] h-11 placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#FF7A2F] focus-visible:ring-offset-0 focus-visible:border-[#FF7A2F] rounded-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Phone Number Input (New) */}
            <div className="space-y-2">
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-[#94a3b8]" />
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="Phone Number" 
                  className="pl-10 bg-white border-[#E2E8F0] text-[#0F172A] h-11 placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#FF7A2F] focus-visible:ring-offset-0 focus-visible:border-[#FF7A2F] rounded-lg"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-[#94a3b8]" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Password" 
                  className="pl-10 bg-white border-[#E2E8F0] text-[#0F172A] h-11 placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#FF7A2F] focus-visible:ring-offset-0 focus-visible:border-[#FF7A2F] rounded-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Sign Up Button */}
            <Button 
              type="submit" 
              className="w-full bg-[#FF7A2F] hover:bg-[#FF8A45] text-white font-bold h-12 rounded-lg shadow-md transition-all duration-200 mt-4 text-base" 
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Sign Up'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center pt-2">
          <p className="text-sm text-[#64748B] font-medium">
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