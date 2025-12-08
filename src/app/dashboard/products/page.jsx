'use client'
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const axiosSecure = useAxiosSecure();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', category: '', image: '', description: '' });

  // 1. Fetch Products
  const { data: products = [], refetch, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await axiosSecure.get('/products'); // তোমার ব্যাকএন্ড রাউট অনুযায়ী
      return res.data;
    }
  });

  // 2. Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
        const productData = {
            ...formData,
            price: parseFloat(formData.price),
            rating: 0 // ডিফল্ট রেটিং
        };
        await axiosSecure.post('/products', productData);
        toast.success("Product added successfully!");
        setFormData({ name: '', price: '', category: '', image: '', description: '' });
        setIsModalOpen(false);
        refetch();
    } catch (error) {
        toast.error("Failed to add product");
    }
  };

  // 3. Delete Product
  const handleDelete = async (id) => {
    if(!confirm("Are you sure?")) return;
    try {
        await axiosSecure.delete(`/products/${id}`);
        toast.success("Product deleted");
        refetch();
    } catch (error) {
        toast.error("Failed to delete");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <Button onClick={() => setIsModalOpen(true)} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Price</th>
              <th className="p-4">Category</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? <tr><td colSpan="5" className="p-4 text-center">Loading...</td></tr> : 
             products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="p-4">
                  <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-md border" />
                </td>
                <td className="p-4 font-medium text-gray-800">{product.name}</td>
                <td className="p-4 text-orange-600 font-bold">${product.price}</td>
                <td className="p-4 text-sm text-gray-500">{product.category}</td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button className="p-2 text-blue-500 hover:bg-blue-50 rounded"><Edit size={18}/></button>
                  <button onClick={() => handleDelete(product._id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal (Simple Implementation) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
           <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-black"><X /></button>
              <h2 className="text-xl font-bold mb-4">Add New Product</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                 <Input placeholder="Product Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                 <div className="grid grid-cols-2 gap-4">
                    <Input type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                    <Input placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
                 </div>
                 <Input placeholder="Image URL" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} required />
                 <textarea 
                    placeholder="Description" 
                    className="w-full border rounded-md p-2 h-24"
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    required 
                 />
                 <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">Submit Product</Button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}