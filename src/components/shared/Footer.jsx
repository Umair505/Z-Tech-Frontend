import Link from "next/link";
import Image from "next/image"; // Import Next Image
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f1012] border-t border-gray-800 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: 4 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-1 group w-fit">
              <div className="w-8 h-8 bg-orange-500 rounded-br-lg rounded-tl-lg flex items-center justify-center text-white font-bold text-xl group-hover:rotate-3 transition-transform duration-300">
                Z
              </div>
              <span className="text-2xl font-bold tracking-tighter text-white">
                TECH
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Z-Tech is your premium destination for the latest gadgets and tech accessories in Chittagong. 
              We deliver innovation right to your doorstep with trust and speed.
            </p>
            
            <div className="flex items-center gap-4">
              {[Facebook, Instagram, Linkedin].map((Icon, idx) => (
                <a 
                  key={idx} 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all duration-300 group"
                >
                  <Icon size={18} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {['Home', 'Latest Gadgets', 'Special Offers', 'About Us', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    href="#" 
                    className="text-sm hover:text-orange-500 hover:pl-2 transition-all duration-300 flex items-center gap-1"
                  >
                    <ArrowRight size={14} className="opacity-0 hover:opacity-100 transition-opacity" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Support */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Support</h3>
            <ul className="space-y-4">
              {['Help Center', 'Order Tracking', 'Returns & Refunds', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <Link 
                    href="#" 
                    className="text-sm hover:text-orange-500 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter & Contact */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-lg">Stay Updated</h3>
            <p className="text-sm text-gray-400">Subscribe for exclusive deals and new product alerts.</p>
            
            <form className="relative">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-[#1a1c20] border border-gray-700 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-orange-500 transition-colors"
              />
              <button className="absolute right-1 top-1 bottom-1 bg-orange-500 hover:bg-orange-600 text-white px-4 rounded-md transition-colors">
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="pt-4 border-t border-gray-800 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <MapPin size={16} className="text-orange-500 flex-shrink-0" />
                <span>Shop #402, Finlay Square, GEC Circle, Chattogram</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Mail size={16} className="text-orange-500 flex-shrink-0" />
                <span>support@ztech.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Phone size={16} className="text-orange-500 flex-shrink-0" />
                <span>+880 1234-567890</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 text-center md:text-left">
            &copy; {currentYear} <span className="text-orange-500 font-semibold">Z-Tech</span>. All rights reserved.
          </p>
          
          {/* Payment Methods */}
          <div className="flex items-center gap-3">
             <span className="text-xs text-gray-500 uppercase tracking-wider">We Accept</span>
             <div className="flex gap-2">
                
                {/* Visa Logo */}
                <div className="h-8 w-12 bg-white rounded flex items-center justify-center overflow-hidden relative">
                    <Image 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" 
                      alt="Visa" 
                      width={40} 
                      height={20} 
                      className="object-contain h-3 w-auto" 
                    />
                </div>

                {/* Mastercard Logo */}
                <div className="h-8 w-12 bg-white rounded flex items-center justify-center overflow-hidden relative">
                     <Image 
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" 
                        alt="Mastercard" 
                        width={40} 
                        height={25}
                        className="object-contain h-4 w-auto" 
                     />
                </div>

                {/* Bkash Badge */}
                <div className="h-8 w-12 bg-pink-600 rounded flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                    Bkash
                </div>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}