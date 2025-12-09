import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = { title: "Z-TECH", description: "Gadget Store" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <QueryProvider>
            {children}
            <Toaster position="top-center" />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}