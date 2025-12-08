import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

export default function MainLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main className="pt-20 min-h-screen">
        {children}
      </main>
      <Footer />
    </div>
  );
}