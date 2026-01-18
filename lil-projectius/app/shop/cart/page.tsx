"use client";

import { useCart } from "@/context/CartContext";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CartPage() {
  // 1. Get hooks for Cart, Convex, User, and Router
  const { items, removeFromCart, cartTotal, clearCart } = useCart();
  const placeOrder = useMutation(api.orders.create);
  const { user } = useUser();
  const router = useRouter();

  // 2. The Checkout Logic
  const handleCheckout = async () => {
    if (items.length === 0) return;

    try {
      // A. Save Order to Convex Database
      await placeOrder({
        items: items,
        total: cartTotal,
        buyerName: user?.fullName || "Guest Customer",
      });

      // B. Clear the Cart from Context
      clearCart();

      // C. Success Message & Redirect
      alert("Order Placed Successfully! We will contact you soon.");
      router.push("/shop"); 

    } catch (error) {
      console.error(error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-6 lg:p-12 font-sans min-h-screen bg-gray-50 text-gray-900">
      
      <h1 className="text-4xl font-extrabold mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        // --- EMPTY STATE ---
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't found anything yet.</p>
          <Link 
            href="/shop" 
            className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        // --- CART CONTENT ---
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT: Item List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <div 
                // Using index in key because duplicate items are allowed for now
                key={`${item.productId}-${index}`} 
                className="bg-white p-4 rounded-xl flex gap-6 items-center shadow-sm border border-gray-100"
              >
                {/* Image */}
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-blue-600 font-bold">{item.price} ₾</p>
                </div>

                {/* Remove Button */}
                <button 
                  onClick={() => removeFromCart(item.productId)}
                  className="text-gray-400 hover:text-red-500 transition p-2"
                  title="Remove item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* RIGHT: Summary & Checkout */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            
            <div className="flex justify-between mb-4 text-gray-500">
              <span>Subtotal</span>
              <span>{cartTotal} ₾</span>
            </div>
            <div className="flex justify-between mb-8 text-gray-500">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>

            <div className="flex justify-between mb-8 text-2xl font-bold border-t pt-4">
              <span>Total</span>
              <span>{cartTotal} ₾</span>
            </div>

            {/* UPDATED BUTTON WITH HANDLE CHECKOUT */}
            <button 
              className="w-full bg-blue-600 text-white py-4 rounded-full font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
              onClick={handleCheckout} 
            >
              Checkout
            </button>
          </div>

        </div>
      )}
    </main>
  );
}