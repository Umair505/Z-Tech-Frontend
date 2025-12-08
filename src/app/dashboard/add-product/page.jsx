import { Upload, X, Save } from 'lucide-react';

export default function AddProductPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Add New Product</h1>
        <p className="text-zinc-400 text-sm">Create a new gadget listing for your store.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
            {/* General Info */}
            <div className="bg-[#121214] border border-zinc-800 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white">General Information</h3>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Product Name</label>
                    <input type="text" placeholder="e.g. CyberBass X1" className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Description</label>
                    <textarea placeholder="Product description..." rows={4} className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none transition-colors" />
                </div>
            </div>

            {/* Pricing */}
            <div className="bg-[#121214] border border-zinc-800 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white">Pricing & Inventory</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Base Price</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                            <input type="number" placeholder="0.00" className="w-full bg-[#09090b] border border-zinc-800 rounded-lg pl-8 pr-4 py-2.5 text-white focus:border-orange-500 focus:outline-none transition-colors" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Stock Quantity</label>
                        <input type="number" placeholder="0" className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none transition-colors" />
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Image & Category */}
        <div className="space-y-6">
            <div className="bg-[#121214] border border-zinc-800 rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-semibold text-white">Product Image</h3>
                <div className="border-2 border-dashed border-zinc-800 rounded-xl h-48 flex flex-col items-center justify-center text-center p-4 hover:border-orange-500/50 hover:bg-zinc-900/50 transition-all cursor-pointer">
                    <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center mb-3">
                        <Upload size={18} className="text-zinc-400" />
                    </div>
                    <p className="text-xs text-zinc-400 font-medium">Click to upload image</p>
                    <p className="text-[10px] text-zinc-600 mt-1">SVG, PNG, JPG (Max 2MB)</p>
                </div>
            </div>

            <div className="bg-[#121214] border border-zinc-800 rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-semibold text-white">Category</h3>
                <select className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none transition-colors">
                    <option>Select Category</option>
                    <option>Headphones</option>
                    <option>Smart Watches</option>
                    <option>Drones</option>
                    <option>Accessories</option>
                </select>
            </div>

            <button className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center gap-2">
                <Save size={18} />
                Publish Product
            </button>
        </div>

      </div>
    </div>
  );
}