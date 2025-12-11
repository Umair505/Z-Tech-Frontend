'use client';
import { useState } from 'react';
import { X, Copy, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function PaymentModal({ isOpen, onClose, totalAmount, onConfirm }) {
  const [method, setMethod] = useState('bkash'); // 'bkash' or 'nagad'
  const [transactionId, setTransactionId] = useState('');
  const [senderNumber, setSenderNumber] = useState('');

  const merchantNumber = "01770039505"; // Your Merchant Number

  const copyNumber = () => {
    navigator.clipboard.writeText(merchantNumber);
    toast.success("Number copied to clipboard!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!transactionId || !senderNumber) {
      return toast.error("Please fill in all payment details");
    }
    // Pass payment details back to parent
    onConfirm({
      method,
      transactionId,
      senderNumber,
      merchantNumber
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="bg-orange-600 p-6 text-white text-center relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold">Make Payment</h2>
            <p className="text-orange-100 text-sm mt-1">Complete your payment to place order</p>
            <div className="mt-4 bg-white/20 rounded-lg p-2 inline-block px-6">
              <span className="text-xs uppercase tracking-widest opacity-80">Total Amount</span>
              <p className="text-3xl font-bold">৳{totalAmount.toLocaleString()}</p>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            
            {/* Method Selector */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setMethod('bkash')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${method === 'bkash' ? 'border-pink-500 bg-pink-50' : 'border-gray-100 hover:bg-gray-50'}`}
              >
                <img src="https://logos-download.com/wp-content/uploads/2022/01/BKash_Logo_icon.png" alt="Bkash" className="h-8 object-contain" />
                <span className={`text-xs font-bold ${method === 'bkash' ? 'text-pink-600' : 'text-gray-500'}`}>Bkash Merchant</span>
              </button>
              <button 
                type="button"
                onClick={() => setMethod('nagad')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${method === 'nagad' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:bg-gray-50'}`}
              >
                <img src="https://download.logo.wine/logo/Nagad/Nagad-Vertical-Logo.wine.png" alt="Nagad" className="h-8 object-contain" />
                <span className={`text-xs font-bold ${method === 'nagad' ? 'text-orange-600' : 'text-gray-500'}`}>Nagad Merchant</span>
              </button>
            </div>

            {/* Instruction */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
               <p className="text-sm text-gray-600 mb-2">Send money to this Merchant Number:</p>
               <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                  <span className="font-mono font-bold text-lg text-gray-800 tracking-wider">{merchantNumber}</span>
                  <button onClick={copyNumber} className="text-gray-400 hover:text-orange-600 transition-colors">
                    <Copy size={18} />
                  </button>
               </div>
               <p className="text-xs text-gray-400 mt-2">* Use "Payment" option in your app.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-1">
                 <label className="text-sm font-medium text-gray-700">Your {method === 'bkash' ? 'Bkash' : 'Nagad'} Number</label>
                 <input 
                   type="tel" 
                   required
                   value={senderNumber}
                   onChange={(e) => setSenderNumber(e.target.value)}
                   placeholder="01XXXXXXXXX"
                   className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                 />
               </div>
               <div className="space-y-1">
                 <label className="text-sm font-medium text-gray-700">Transaction ID (TrxID)</label>
                 <input 
                   type="text" 
                   required
                   value={transactionId}
                   onChange={(e) => setTransactionId(e.target.value)}
                   placeholder="e.g. 8N7A6D5..."
                   className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 uppercase"
                 />
               </div>

               <button 
                 type="submit" 
                 className="w-full py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
               >
                 <CheckCircle size={18} /> Confirm Payment
               </button>
            </form>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}