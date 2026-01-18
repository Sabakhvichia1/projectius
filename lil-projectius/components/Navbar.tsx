"use client";

import Link from "next/link";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { useCart } from "@/context/CartContext"; 

export default function Navbar() {
  const { user } = useUser();
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { cartCount } = useCart(); 

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* LEFT: Logo & Main Links */}
          <div className="flex items-center gap-8">
            <Link href="/shop" className="text-2xl font-extrabold tracking-tighter text-black">
              Voloostore<span className="text-blue-600">.</span>
            </Link>

            <div className="hidden md:flex gap-6">
              <Link href="/shop" className="text-gray-600 hover:text-black font-medium transition">
                Marketplace
              </Link>
              <Link href="/" className="text-gray-600 hover:text-black font-medium transition">
                Seller Portal
              </Link>
            </div>
          </div>

          {/* RIGHT: Authentication & Actions */}
          <div className="flex items-center gap-4">
            
            {/* --- NEW: CART BUTTON --- */}
            <Link 
                href="/shop/cart"
                className="relative bg-white text-black p-2 rounded-full hover:bg-gray-100 transition border border-gray-200"
            >
                {/* Shopping Bag Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 5c.07.286.07.588.07.886 0 2.21-1.79 4-4 4H7c-2.21 0-4-1.79-4-4 0-.298 0-.6.07-.886l1.263-5a4.002 4.002 0 013.843-3.007A8.96 8.96 0 0112 5.5c1.47 0 2.87.425 4.066 1.157a4.001 4.001 0 013.69 2.85z" />
                </svg>

                {/* The Red Badge Counter */}
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {cartCount}
                  </span>
                )}
            </Link>
            {/* ------------------------ */}


            {/* Show loading state while checking auth */}
            {isLoading ? (
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 hidden sm:block">
                  Hey, {user?.firstName}
                </span>
                <UserButton afterSignOutUrl="/shop" />
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
          
        </div>
      </div>
    </nav>
  );
}