import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/providers/AuthProvider";
import QueryProvider from "@/providers/QueryProvider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Z-Tech | Premium Gadget Shop in Chattogram",
  description:
    "Discover the latest tech gadgets, mobile accessories, and smart devices at Z-Tech. Located in GEC Circle, Chattogram. Trusted quality, fast delivery, and secure payments.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <QueryProvider>
            <Navbar />
            <main className="pt-20 min-h-screen">{children}</main>
            <Toaster
              theme="light"
              richColors={true}
              position="top-right"
              closeButton
            />
            <Toaster position="top-center" reverseOrder={false} />
            <Footer />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
