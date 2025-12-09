'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Save, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AddProductPage() {
  const fileInputRef = useRef(null);
  
  // Form State
  const [form, setForm] = useState({
    name: '',
    brand: '',
    category: '',
    slug: '',
    description: '',
    price: '',
    stock: '',
    metaTitle: '',
    metaDescription: '',
    isFeatured: false,
    isPopular: false,
    isNewArrival: false,
  });

  // Validation Error State
  const [errors, setErrors] = useState({});

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  const API = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Clear error when user types
    if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
    }

    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selected]);
      
      const newPreviews = selected.map(f => URL.createObjectURL(f));
      setPreviews((prev) => [...prev, ...newPreviews]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removePreview = (index) => {
    URL.revokeObjectURL(previews[index]);
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Validation Helper
  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.price) newErrors.price = "Price is required";
    if (!form.category) newErrors.category = "Category is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async () => {
    // 1. Run Validation
    if (!validateForm()) {
        toast.error("Please fill in all required fields marked with *");
        return;
    }
    
    setUploading(true);
    const toastId = toast.loading("Uploading images & creating product...");

    try {
      // 2. Upload images
      let imageUrls = [];
      
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach(f => {
            formData.append('files', f); 
        });

        const res = await fetch(`${API}/upload`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        const data = await res.json();
        
        if (!res.ok) throw new Error(data?.error || 'Image upload failed');
        
        imageUrls = data.files.map(f => f.url);
      }

      // 3. Prepare product object
      const product = {
        ...form,
        slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        price: Number(form.price),
        stock: Number(form.stock),
        images: imageUrls,
        createdAt: new Date()
      };

      // 4. Send to backend
      const res2 = await fetch(`${API}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
        credentials: 'include' 
      });
      
      const result = await res2.json();
      
      if (!res2.ok) throw new Error(result?.message || 'Failed to publish product');

      toast.success('Product published successfully!', { id: toastId });
      
      // Reset Form
      setForm({
        name: '', brand: '', category: '', slug: '', description: '',
        price: '', stock: '', metaTitle: '', metaDescription: '',
        isFeatured: false, isPopular: false, isNewArrival: false,
      });
      setFiles([]);
      setPreviews([]);
      setErrors({});

    } catch (err) {
      console.error("Submit Error:", err);
      toast.error(`Failed: ${err.message}`, { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-white">Add New Product</h1>
        <p className="text-zinc-400 text-sm">Create a new gadget listing for your store.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#121214] border border-zinc-800 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">General Information</h3>
            
            {/* Product Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Product Name <span className="text-red-500">*</span></label>
              <input 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                type="text" 
                placeholder="e.g. CyberBass X1" 
                className={`w-full bg-[#09090b] border rounded-lg px-4 py-2.5 text-white focus:outline-none transition-colors ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-orange-500'}`} 
              />
              {errors.name && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12}/> {errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Brand</label>
              <input name="brand" value={form.brand} onChange={handleChange} type="text" placeholder="Brand Name" className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Product description..." rows={4} className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Meta Title</label>
              <input name="metaTitle" value={form.metaTitle} onChange={handleChange} type="text" placeholder="SEO Meta Title" className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Meta Description</label>
              <input name="metaDescription" value={form.metaDescription} onChange={handleChange} type="text" placeholder="SEO Meta Description" className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none transition-colors" />
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-[#121214] border border-zinc-800 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Pricing & Inventory</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Price */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Base Price <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                  <input 
                    name="price" 
                    value={form.price} 
                    onChange={handleChange} 
                    type="number" 
                    placeholder="0.00" 
                    className={`w-full bg-[#09090b] border rounded-lg pl-8 pr-4 py-2.5 text-white focus:outline-none transition-colors ${errors.price ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-orange-500'}`} 
                  />
                </div>
                {errors.price && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12}/> {errors.price}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Stock Quantity</label>
                <input name="stock" value={form.stock} onChange={handleChange} type="number" placeholder="0" className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Image Upload */}
          <div className="bg-[#121214] border border-zinc-800 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white">Product Images</h3>
            
            <div
              className="border-2 border-dashed border-zinc-800 rounded-xl h-48 flex flex-col items-center justify-center text-center p-4 hover:border-orange-500/50 hover:bg-zinc-900/50 transition-all cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center mb-3">
                <Upload size={18} className="text-zinc-400" />
              </div>
              <p className="text-xs text-zinc-400 font-medium">Click to upload image</p>
              <p className="text-[10px] text-zinc-600 mt-1">Multiple files allowed</p>
            </div>
            
            <input 
                ref={fileInputRef}
                type="file" 
                multiple 
                className="hidden" 
                onChange={handleFileChange} 
                accept="image/*"
            />
            
            <div className="grid grid-cols-3 gap-2 mt-2">
              {previews.map((p, i) => (
                <div key={i} className="relative group h-20 w-full">
                  <Image 
                    src={p} 
                    alt="preview"
                    fill
                    className="object-cover rounded-lg border border-zinc-800"
                    unoptimized
                  />
                  <button 
                    type="button" 
                    onClick={() => removePreview(i)} 
                    className="absolute -top-1 -right-1 z-10 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="bg-[#121214] border border-zinc-800 rounded-xl p-6 space-y-4">
            <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white">Category <span className="text-red-500">*</span></h3>
                <select 
                    value={form.category} 
                    onChange={handleChange} 
                    name="category" 
                    className={`w-full bg-[#09090b] border rounded-lg px-4 py-2.5 text-white focus:outline-none transition-colors ${errors.category ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-orange-500'}`}
                >
                <option value="">Select Category</option>
                <option>Smartphones</option>
                <option>Laptops</option>
                <option>Tablets & iPads</option>
                <option>Smart Watches</option>
                <option>Headphones</option>
                <option>Earbuds</option>
                <option>Earphone</option>
                <option>Speakers & Audio</option>
                <option>Gaming Consoles</option>
                <option>VR & AR</option>
                <option>Cameras & Drones</option>
                <option>Smart Home</option>
                <option>Accessories</option>
                </select>
                {errors.category && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12}/> {errors.category}</p>}
            </div>
            
            <div className="flex flex-col space-y-2 mt-4 pt-4 border-t border-zinc-800/50">
               <label className="flex items-center gap-2 cursor-pointer">
                 <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="accent-orange-500 w-4 h-4" />
                 <span className="text-sm text-zinc-300">Featured Product</span>
               </label>
               <label className="flex items-center gap-2 cursor-pointer">
                 <input type="checkbox" name="isPopular" checked={form.isPopular} onChange={handleChange} className="accent-orange-500 w-4 h-4" />
                 <span className="text-sm text-zinc-300">Popular Item</span>
               </label>
               <label className="flex items-center gap-2 cursor-pointer">
                 <input type="checkbox" name="isNewArrival" checked={form.isNewArrival} onChange={handleChange} className="accent-orange-500 w-4 h-4" />
                 <span className="text-sm text-zinc-300">New Arrival</span>
               </label>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {uploading ? 'Publishing...' : 'Publish Product'}
          </button>
        </div>
      </div>
    </div>
  );
}