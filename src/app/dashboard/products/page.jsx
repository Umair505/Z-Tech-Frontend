'use client'
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit, Plus, X, Save, Loader2, Upload, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import Swal from 'sweetalert2'; 

export default function ProductsPage() {
  const axiosSecure = useAxiosSecure();
  
  // States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [newImages, setNewImages] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(''); // New State for Search

  // 1. Fetch Products
  const { data: products = [], refetch, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await axiosSecure.get('/products'); 
      return res.data;
    }
  });

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Open Edit Modal with Data
  const openEditModal = (product) => {
    setEditingProduct({ ...product });
    setNewImages([]); 
    setIsEditModalOpen(true);
  };

  // Handle New Image Selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
  };

  // 3. Handle Update (PUT Request with Image Upload)
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const toastId = toast.loading("Updating product...");

    try {
        let updatedImageUrls = editingProduct.images || [];

        // A. If new images are selected, upload them first
        if (newImages.length > 0) {
            const formData = new FormData();
            newImages.forEach(file => formData.append('files', file));

            // Upload request
            const uploadRes = await axiosSecure.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (uploadRes.data.success) {
                updatedImageUrls = uploadRes.data.files.map(f => f.url);
            }
        }

        // B. Prepare Data for Update
        const { _id, ...restData } = editingProduct;
        const updateData = {
            ...restData,
            price: Number(editingProduct.price),
            stock: Number(editingProduct.stock),
            images: updatedImageUrls 
        };

        // C. Send PUT Request
        await axiosSecure.put(`/products/${_id}`, updateData);
        
        toast.success("Product updated successfully!", { id: toastId });
        refetch();
        setIsEditModalOpen(false);
    } catch (error) {
        console.error("Update failed:", error);
        toast.error("Failed to update product", { id: toastId });
    } finally {
        setUpdating(false);
    }
  };

  // 4. Delete Product with SweetAlert2
  const handleDelete = async (id) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ea580c', 
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/products/${id}`);
                Swal.fire(
                    'Deleted!',
                    'Product has been deleted.',
                    'success'
                );
                refetch();
            } catch (error) {
                toast.error("Failed to delete");
            }
        }
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Product Inventory</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your store's catalog</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                    placeholder="Search products..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-gray-300 focus:ring-orange-500"
                />
            </div>

            <Link href="/dashboard/add-product">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20 transition-all w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Add New Product
                </Button>
            </Link>
        </div>
      </div>

      {/* Product Table - Responsive Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs font-semibold tracking-wider">
                <tr>
                <th className="p-5">Product</th>
                <th className="p-5">Price</th>
                <th className="p-5">Category</th>
                <th className="p-5">Stock</th>
                <th className="p-5 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                    <tr><td colSpan="5" className="p-10 text-center text-gray-500">Loading products...</td></tr>
                ) : filteredProducts.length === 0 ? (
                    <tr><td colSpan="5" className="p-10 text-center text-gray-500">No products found.</td></tr>
                ) : (
                filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg border border-gray-200 overflow-hidden relative bg-white shrink-0">
                                {product.images?.[0] ? (
                                    <Image 
                                        src={product.images[0]} 
                                        alt={product.name} 
                                        fill 
                                        className="object-contain p-1"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Img</div>
                                )}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-sm line-clamp-1 max-w-[200px]">{product.name}</p>
                                <p className="text-xs text-gray-500">{product.brand}</p>
                            </div>
                        </div>
                    </td>
                    <td className="p-5">
                        <span className="font-bold text-gray-900">৳{product.price}</span>
                    </td>
                    <td className="p-5 text-sm text-gray-600">
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium border border-blue-100 whitespace-nowrap">
                            {product.category}
                        </span>
                    </td>
                    <td className="p-5 text-sm text-gray-600">
                        <span className={`px-2 py-1 rounded text-xs font-medium border whitespace-nowrap ${product.stock > 0 ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                    </td>
                    <td className="p-5 text-right">
                        <div className="flex justify-end gap-2">
                            <button 
                                onClick={() => openEditModal(product)} 
                                className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                title="Edit"
                            >
                                <Edit size={16}/>
                            </button>
                            <button 
                                onClick={() => handleDelete(product._id)} 
                                className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                title="Delete"
                            >
                                <Trash2 size={16}/>
                            </button>
                        </div>
                    </td>
                </tr>
                )))}
            </tbody>
            </table>
        </div>
      </div>

      {/* --- EDIT MODAL --- */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden flex flex-col my-auto">
              
              {/* Modal Header */}
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="text-lg font-bold text-gray-800">Edit Product</h3>
                  <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition">
                      <X size={20} />
                  </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                  <form id="edit-form" onSubmit={handleUpdate} className="space-y-4">
                     
                     {/* Image Update Section */}
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Update Image</label>
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 border rounded-lg overflow-hidden relative bg-gray-50 shrink-0">
                                {newImages.length > 0 ? (
                                    <img src={URL.createObjectURL(newImages[0])} alt="New" className="h-full w-full object-cover" />
                                ) : editingProduct.images?.[0] ? (
                                    <Image src={editingProduct.images[0]} alt="Current" fill className="object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                                )}
                            </div>
                            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                                <Upload size={16} /> Choose New File
                                <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                            </label>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Product Name</label>
                        <Input 
                            value={editingProduct.name} 
                            onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} 
                            className="bg-white border-gray-300 focus:ring-orange-500 text-gray-900"
                            required 
                        />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Price</label>
                            <Input 
                                type="number" 
                                value={editingProduct.price} 
                                onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} 
                                className="bg-white border-gray-300 focus:ring-orange-500 text-gray-900"
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Stock</label>
                            <Input 
                                type="number" 
                                value={editingProduct.stock} 
                                onChange={e => setEditingProduct({...editingProduct, stock: e.target.value})} 
                                className="bg-white border-gray-300 focus:ring-orange-500 text-gray-900"
                                required 
                            />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Category</label>
                        <select 
                            value={editingProduct.category} 
                            onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option>Smartphones</option>
                            <option>Laptops</option>
                            <option>Tablets & iPads</option>
                            <option>Smart Watches</option>
                            <option>Headphones</option>
                            <option>Earbuds</option>
                            <option>Speakers & Audio</option>
                            <option>Accessories</option>
                        </select>
                     </div>

                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <textarea 
                            value={editingProduct.description} 
                            onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                            rows={4}
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                     </div>
                  </form>
              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditModalOpen(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    form="edit-form"
                    disabled={updating}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                  >
                    {updating ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Changes
                  </Button>
              </div>

           </div>
        </div>
      )}
    </div>
  );
}