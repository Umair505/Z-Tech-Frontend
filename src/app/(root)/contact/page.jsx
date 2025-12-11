'use client';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission
    setTimeout(() => {
        toast.success("Message sent successfully! We'll get back to you soon.");
        setLoading(false);
        e.target.reset();
    }, 1500);
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      
      {/* Header */}
      <div className="bg-[#0f1012] py-20 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Get in Touch</h1>
            <p className="text-xl text-gray-400">Have questions about a product or your order? We're here to help.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-8">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-bl-full transition-transform group-hover:scale-150"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-4">
                            <Phone size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Phone Support</h3>
                        <p className="text-gray-500 mb-4">Mon-Fri from 9am to 6pm</p>
                        <a href="tel:+8801770039505" className="text-lg font-bold text-orange-600 hover:underline">+880 1770 039 505</a>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full transition-transform group-hover:scale-150"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                            <Mail size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
                        <p className="text-gray-500 mb-4">We reply within 24 hours</p>
                        <a href="mailto:support@ztech.com" className="text-lg font-bold text-blue-600 hover:underline">support@ztech.com</a>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-bl-full transition-transform group-hover:scale-150"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                            <MessageCircle size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">WhatsApp</h3>
                        <p className="text-gray-500 mb-4">Instant chat support</p>
                        <a 
                            href="https://wa.me/8801770039505" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-lg font-bold text-green-600 hover:underline"
                        >
                            Chat on WhatsApp
                        </a>
                    </div>
                </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">First Name</label>
                                <input type="text" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all" placeholder="John" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Last Name</label>
                                <input type="text" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all" placeholder="Doe" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                            <input type="email" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all" placeholder="john@example.com" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Message</label>
                            <textarea required rows={5} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none" placeholder="How can we help you?"></textarea>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {loading ? 'Sending...' : (
                                <>
                                    Send Message <Send size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

        </div>
      </div>

    </div>
  );
}