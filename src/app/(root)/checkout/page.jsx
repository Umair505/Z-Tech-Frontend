'use client';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import useAuth from '@/hooks/useAuth';
import { Loader2, MapPin, Phone, User, Mail, CreditCard, Banknote } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'online'
  
  // Form State
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    phone: '',
    district: '',
    address: '',
  });

  // 1. Fetch Cart Data
  const { data: cart = [], isLoading: isCartLoading } = useQuery({
    queryKey: ['cart', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get('/cart');
      return res.data;
    }
  });

  // 2. Calculations
  const subtotal = cart.reduce((total, item) => total + ((Number(item.price) || 0) * (item.quantity || 1)), 0);
  const shipping = 60; // Fixed shipping as per design
  const total = subtotal + shipping;

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 3. Place Order Handler
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.address || !formData.district) {
      return toast.error("Please fill in all billing details");
    }

    if (cart.length === 0) {
      return toast.error("Your cart is empty");
    }

    setLoading(true);

    const orderData = {
      customer: {
        name: formData.name,
        email: user?.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.district}`
      },
      products: cart.map(item => ({
        productId: item.productId, // Assuming cart item has productId
        name: item.name,
        quantity: item.quantity || 1,
        price: item.price,
        image: item.image
      })),
      paymentMethod,
      subtotal,
      shipping,
      totalAmount: total,
      currency: 'BDT',
      transactionId: paymentMethod === 'online' ? `TXN-${Date.now()}` : null,
      date: new Date().toISOString(), // The backend also sets createdAt, sending date for record
    };

    try {
      // A. Post Order to Backend
      const res = await axiosSecure.post('/order', orderData);
      
      if (res.data.insertedId) {
        toast.success("Order placed successfully! 🎉");
        
     
        
        // Clearing cart items loop (Temporary frontend fix if backend doesn't clear cart on order)
        await Promise.all(cart.map(item => axiosSecure.delete(`/cart/${item._id}`)));
        queryClient.invalidateQueries(['cart']);

        // C. Redirect to Orders Page or Success Page
        router.push('/orders'); 
      }
    } catch (error) {
      console.error("Order Error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isCartLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Checkout...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center md:text-left">Checkout</h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN: BILLING DETAILS --- */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-orange-600 mb-6 uppercase tracking-wide">Billing Details</h2>
              
              <div className="space-y-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Full Name"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors bg-gray-50"
                      required
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input 
                        type="email" 
                        value={user?.email}
                        disabled
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="01XXXXXXXXX"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors bg-gray-50"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* District & Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      District <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                      <select 
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors bg-gray-50 appearance-none"
                        required
                      >
                        <option value="">Select District</option>
                        <option value="Dhaka">Dhaka</option>
                        <option value="Chittagong">Chittagong</option>
                        <option value="Sylhet">Sylhet</option>
                        <option value="Rajshahi">Rajshahi</option>
                        <option value="Khulna">Khulna</option>
                        <option value="Barisal">Barisal</option>
                        <option value="Rangpur">Rangpur</option>
                        <option value="Mymensingh">Mymensingh</option>
                        <option value="Comilla">Comilla</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="text" 
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="House, Road, Area etc."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors bg-gray-50"
                        required
                    />
                  </div>
                </div>

                {/* Full Address Textarea */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Detailed Address (Optional)</label>
                    <textarea 
                        name="addressDetails"
                        placeholder="Additional instructions for delivery..."
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors bg-gray-50"
                    />
                </div>

              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: ORDER SUMMARY --- */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-orange-600 mb-6 uppercase tracking-wide text-center">Your Order</h2>
              
              {/* Product List */}
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {cart.map((item) => (
                    <div key={item._id} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-gray-50 rounded-md border border-gray-200 relative overflow-hidden">
                                {item.image ? (
                                    <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">No Img</div>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-800 line-clamp-1 w-32" title={item.name}>{item.name}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity || 1}</p>
                            </div>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">৳{((Number(item.price) || 0) * (item.quantity || 1)).toLocaleString()}</p>
                    </div>
                ))}
              </div>

              {/* Calculations */}
              <div className="space-y-3 py-4 border-t border-b border-gray-100">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium">৳{shipping.toLocaleString()}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-4">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-orange-600">৳{total.toLocaleString()}</span>
              </div>

              {/* Payment Method */}
              <div className="space-y-3 mb-6">
                <p className="text-sm font-bold text-gray-700 uppercase">Payment Method</p>
                
                <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input 
                        type="radio" 
                        name="payment" 
                        value="cod" 
                        checked={paymentMethod === 'cod'} 
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-orange-600 w-4 h-4"
                    />
                    <Banknote size={20} className="text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Cash on Delivery</span>
                </label>

                <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input 
                        type="radio" 
                        name="payment" 
                        value="online" 
                        checked={paymentMethod === 'online'} 
                        onChange={() => setPaymentMethod('online')}
                        className="accent-orange-600 w-4 h-4"
                    />
                    <CreditCard size={20} className="text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Online Payment</span>
                </label>
              </div>

              {/* Place Order Button */}
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white py-3.5 rounded-lg font-bold text-lg hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Place Order'} ৳{total.toLocaleString()}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing your order, you agree to our <span className="text-orange-600 cursor-pointer hover:underline">Terms & Conditions</span>.
              </p>

            </div>
          </div>

        </form>
      </div>
    </div>
  );
}