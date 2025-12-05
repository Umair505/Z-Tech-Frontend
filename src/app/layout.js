import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

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
  description: "Discover the latest tech gadgets, mobile accessories, and smart devices at Z-Tech. Located in GEC Circle, Chattogram. Trusted quality, fast delivery, and secure payments.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main className="pt-20 min-h-screen"> 
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
