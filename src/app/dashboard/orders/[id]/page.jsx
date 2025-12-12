'use client';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Printer, Mail, MapPin, Phone, User, CreditCard, Calendar, Package, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const axiosSecure = useAxiosSecure();
  const componentRef = useRef(null);

  // Fetch Order Details
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/admin/orders/${id}`);
      return res.data;
    }
  });

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Order_${order?._id}`,
  });

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-orange-600" size={40} />
    </div>
  );
  
  if (!order) return (
    <div className="min-h-screen flex items-center justify-center text-red-500">
      Order not found
    </div>
  );

  // Status Colors Helper
  const getStatusStyle = (status) => {
    switch(status?.toLowerCase()) {
        case 'completed': 
        case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
        case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'processing': 
        case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8 pb-10 sm:pb-20 px-3 sm:px-4 lg:px-0">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 no-print">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm sm:text-base"
        >
          <ArrowLeft size={18} className="sm:w-5 sm:h-5" /> Back to Orders
        </button>
        <button 
          onClick={() => handlePrint()}
          className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium shadow-sm text-sm sm:text-base w-full sm:w-auto"
        >
          <Printer size={16} className="sm:w-[18px] sm:h-[18px]" /> Print Invoice
        </button>
      </div>

      {/* --- PRINTABLE AREA --- */}
      <div ref={componentRef} className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm print:shadow-none print:border-none">
        
        {/* Invoice Header */}
        <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-100 flex flex-col gap-4 sm:gap-6 bg-gray-50/50">
           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
              <div className="flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                  Order #{order._id.slice(-6).toUpperCase()}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
                  <Calendar size={12} className="sm:w-3.5 sm:h-3.5" /> 
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <span className={`inline-flex items-center justify-center px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold border capitalize ${getStatusStyle(order.status)} self-start sm:self-auto`}>
                {order.status}
              </span>
           </div>
        </div>

        {/* Customer & Payment Info Grid */}
        <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
           
           {/* Customer Details */}
           <div className="space-y-4 sm:space-y-6">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2">
                Customer Details
              </h3>
              <div className="space-y-3 sm:space-y-4">
                 <div className="flex gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                       <User size={16} className="sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                       <p className="text-xs sm:text-sm text-gray-500">Name</p>
                       <p className="font-semibold text-gray-900 text-sm sm:text-base">{order.customer?.name}</p>
                    </div>
                 </div>
                 <div className="flex gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                       <Mail size={16} className="sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                       <p className="text-xs sm:text-sm text-gray-500">Email</p>
                       <p className="font-semibold text-gray-900 text-sm sm:text-base break-words">{order.customer?.email}</p>
                    </div>
                 </div>
                 <div className="flex gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                       <Phone size={16} className="sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                       <p className="text-xs sm:text-sm text-gray-500">Phone</p>
                       <p className="font-semibold text-gray-900 text-sm sm:text-base">{order.customer?.phone}</p>
                    </div>
                 </div>
                 <div className="flex gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                       <MapPin size={16} className="sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                       <p className="text-xs sm:text-sm text-gray-500">Shipping Address</p>
                       <p className="font-semibold text-gray-900 text-sm sm:text-base leading-relaxed">{order.customer?.address}</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Payment Details */}
           <div className="space-y-4 sm:space-y-6">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2">
                Payment Information
              </h3>
              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-100 space-y-3 sm:space-y-4">
                 <div className="flex justify-between items-center gap-2">
                    <span className="text-gray-600 text-xs sm:text-sm">Payment Method</span>
                    <span className="font-bold text-gray-900 uppercase text-xs sm:text-sm">{order.payment?.method}</span>
                 </div>
                 <div className="flex justify-between items-center gap-2">
                    <span className="text-gray-600 text-xs sm:text-sm">Payment Status</span>
                    <span className={`px-2 py-1 rounded text-[10px] sm:text-xs font-bold capitalize ${order.payment?.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {order.payment?.status}
                    </span>
                 </div>
                 {order.payment?.transactionId && (
                     <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 pt-2 border-t border-gray-200">
                        <span className="text-gray-600 text-xs sm:text-sm">Transaction ID</span>
                        <span className="font-mono font-bold text-gray-900 text-xs sm:text-sm break-all">{order.payment.transactionId}</span>
                     </div>
                 )}
                 {order.payment?.senderNumber && (
                     <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                        <span className="text-gray-600 text-xs sm:text-sm">Sender Number</span>
                        <span className="font-mono font-bold text-gray-900 text-xs sm:text-sm">{order.payment.senderNumber}</span>
                     </div>
                 )}
              </div>
           </div>

        </div>

        {/* Order Items Section */}
        <div className="p-4 sm:p-6 lg:p-8 lg:pt-0">
           <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-3 sm:pb-4 mb-3 sm:mb-4">
             Order Items
           </h3>
           
           {/* Desktop Table View */}
           <div className="hidden md:block overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                   <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                      <th className="pb-3 font-medium">Product</th>
                      <th className="pb-3 font-medium text-center">Quantity</th>
                      <th className="pb-3 font-medium text-right">Price</th>
                      <th className="pb-3 font-medium text-right">Total</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {order.products.map((item, idx) => (
                      <tr key={idx}>
                         <td className="py-4">
                            <div className="flex items-center gap-4">
                               <div className="h-12 w-12 rounded-lg border border-gray-200 overflow-hidden relative bg-white shrink-0">
                                   {item.image ? (
                                      <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                                   ) : (
                                      <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">No Img</div>
                                   )}
                               </div>
                               <p className="font-medium text-gray-900 line-clamp-2 text-sm">{item.name}</p>
                            </div>
                         </td>
                         <td className="py-4 text-center text-gray-600 text-sm">x{item.quantity}</td>
                         <td className="py-4 text-right text-gray-600 text-sm">৳{item.price?.toLocaleString()}</td>
                         <td className="py-4 text-right font-bold text-gray-900 text-sm">৳{(item.price * item.quantity).toLocaleString()}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
           </div>

           {/* Mobile Card View */}
           <div className="md:hidden space-y-3">
              {order.products.map((item, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="flex gap-3 mb-3">
                    <div className="h-16 w-16 rounded-lg border border-gray-200 overflow-hidden relative bg-white shrink-0">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">No Img</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm mb-1 line-clamp-2 leading-tight">{item.name}</p>
                      <p className="text-xs text-gray-500">Quantity: x{item.quantity}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-xs text-gray-600">Unit Price: ৳{item.price?.toLocaleString()}</span>
                    <span className="font-bold text-orange-600 text-sm">৳{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Totals Section */}
        <div className="bg-gray-50 p-4 sm:p-6 lg:p-8 border-t border-gray-200">
           <div className="flex flex-col gap-2.5 sm:gap-3 ml-auto max-w-full sm:max-w-xs">
              <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                 <span>Subtotal</span>
                 <span className="font-medium">৳{order.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                 <span>Shipping</span>
                 <span className="font-medium">৳{order.shipping?.toLocaleString()}</span>
              </div>
              <div className="h-px bg-gray-200 my-1"></div>
              <div className="flex justify-between text-base sm:text-lg font-bold text-gray-900">
                 <span>Total Amount</span>
                 <span className="text-orange-600">৳{order.totalAmount?.toLocaleString()}</span>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}