"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export default function SellerDashboard() {
  // --- DATABASE HOOKS ---
  const products = useQuery(api.products.get);
  const orders = useQuery(api.orders.get); // <--- THIS WAS MISSING
  
  const createProduct = useMutation(api.products.create);
  const generateUploadUrl = useMutation(api.products.generateUploadUrl);
  const deleteProduct = useMutation(api.products.deleteProduct);
  const markShipped = useMutation(api.orders.markAsShipped); 

  // --- LOCAL STATE ---
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");

  const imageInput = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // --- FORM SUBMISSION LOGIC ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let storageId = undefined;

      if (selectedImage) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": selectedImage.type },
          body: selectedImage,
        });

        const json = await result.json();
        if (!result.ok) throw new Error(`Upload failed: ${json.error}`);
        storageId = json.storageId;
      }

      await createProduct({
        name,
        description: desc,
        price: parseFloat(price),
        storageId,
      });

      setName("");
      setPrice("");
      setDesc("");
      setSelectedImage(null);
      if (imageInput.current) imageInput.current.value = "";
    } catch (error) {
      console.error("Failed to create product:", error);
      alert("Something went wrong.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- THE UI ---
  return (
    <main className="bg-black min-h-screen p-10 font-sans text-gray-100">
      <div className="max-w-6xl mx-auto">
        
        <h1 className="text-4xl font-extrabold mb-8 text-white tracking-tight">
          Voloostore <span className="text-blue-500">Seller</span>
        </h1>

        {/* --- INPUT FORM SECTION --- */}
        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl mb-12">
          <h2 className="text-xl font-semibold mb-6 text-gray-200 border-b border-gray-800 pb-2">
            Add New Product
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-400">Product Name</label>
              <input
                placeholder="e.g. Walnut Coaster Set"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
                required
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-col gap-1 md:w-32">
                <label className="text-sm font-medium text-gray-400">Price (GEL)</label>
                <input
                  placeholder="25"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  required
                />
              </div>

              <div className="flex flex-col gap-1 flex-1">
                <label className="text-sm font-medium text-gray-400">Description</label>
                <input
                  placeholder="Materials, dimensions, etc..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-400">Product Image</label>
              <input
                type="file"
                accept="image/*"
                ref={imageInput}
                onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                className="p-2 border border-dashed border-gray-700 bg-gray-800/50 rounded-lg text-sm text-gray-400 hover:bg-gray-800 transition cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className={`mt-4 p-4 rounded-lg font-bold text-white transition shadow-lg ${isUploading ? "bg-gray-700 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"}`}
            >
              {isUploading ? "Uploading..." : "Add to Inventory"}
            </button>
          </form>
        </div>

        {/* --- INVENTORY GRID --- */}
        <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-blue-500 pl-4">
          Your Inventory
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {products?.map((product) => (
            <div key={product._id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg relative group">
              <div className="w-full h-56 bg-gray-800 relative">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                )}
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-white leading-tight">{product.name}</h3>
                  <span className="bg-gray-800 text-blue-400 border border-gray-700 px-3 py-1 rounded-full text-sm font-bold shadow-inner">
                    {product.price} ₾
                  </span>
                </div>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4">{product.description}</p>
                <div className="text-xs text-gray-600 pt-3 border-t border-gray-800 font-mono">
                    ID: {product._id.slice(0, 8)}...
                </div>
              </div>
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  if (confirm("Delete this?")) await deleteProduct({ productId: product._id });
                }}
                className="absolute top-2 right-2 bg-red-500/90 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
              </button>
            </div>
          ))}
        </div>

        {/* --- INCOMING ORDERS SECTION --- */}
        <div className="mt-20 border-t border-gray-800 pt-10 pb-20">
          <h2 className="text-3xl font-bold mb-6 text-white border-l-4 border-green-500 pl-4">
            Incoming Orders
          </h2>

          <div className="space-y-4">
            {orders === undefined ? (
               <p className="text-gray-500">Loading orders...</p>
            ) : orders.length === 0 ? (
               <p className="text-gray-500">No orders yet.</p>
            ) : (
               orders.map((order) => (
              <div key={order._id} className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex flex-col md:flex-row justify-between items-center shadow-lg">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'new' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                      {order.status.toUpperCase()}
                    </span>
                    <h3 className="font-bold text-lg text-white">{order.buyerName}</h3>
                  </div>
                  <div className="text-gray-400 text-sm">
                    {order.items.map((item: any, i: number) => (
                      <span key={i} className="mr-2">{item.name} ({item.price} ₾),</span>
                    ))}
                  </div>
                  <div className="mt-2 font-mono text-xs text-gray-600">ID: {order._id}</div>
                </div>

                <div className="flex items-center gap-6">
                  <span className="text-2xl font-bold text-white">{order.total} ₾</span>
                  {order.status === "new" ? (
                    <button 
                      onClick={() => markShipped({ orderId: order._id })}
                      className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition"
                    >
                      Mark Shipped
                    </button>
                  ) : (
                    <button disabled className="bg-gray-700 text-gray-500 px-4 py-2 rounded-lg text-sm font-bold cursor-not-allowed">
                      Shipped
                    </button>
                  )}
                </div>
              </div>
            )))}
          </div>
        </div>

      </div>
    </main>
  );
}