"use client";

// We need 'useParams' to read the [productId] from the URL
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function ProductPage() {
  const params = useParams();
  const { addToCart } = useCart(); // <--- Get function

  // TypeScript Magic: Ensure the ID is the correct format
  const productId = params.productId as Id<"products">;

  // Fetch the specific product
  const product = useQuery(api.products.getById, { productId });

  // 1. Loading State
  if (product === undefined) {
    return (
      <div className="p-20 text-center text-gray-500">Loading details...</div>
    );
  }

  // 2. Not Found State (e.g. deleted product)
  if (product === null) {
    return <div className="p-20 text-center">Product not found.</div>;
  }

  return (
    <main className="max-w-6xl mx-auto p-6 lg:p-12 font-sans bg-white min-h-screen text-gray-900">
      {/* Breadcrumb / Back Button */}
      <div className="mb-8">
        <Link
          href="/shop"
          className="text-gray-500 hover:text-black transition flex items-center gap-2 text-sm font-medium"
        >
          ← Back to Shop
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* LEFT: Image */}
        <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-square relative shadow-sm">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No Image Available
            </div>
          )}
        </div>

        {/* RIGHT: Details */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-gray-900">
            {product.name}
          </h1>

          <div className="text-2xl font-semibold text-blue-600 mb-8">
            {product.price} ₾
          </div>

          <div className="prose prose-lg text-gray-600 mb-10 leading-relaxed">
            {product.description || "No description provided."}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <button
              className="w-full bg-blue-600 text-white py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-200"
              onClick={() => {
                if (product) {
                  addToCart({
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl,
                  });
                }
              }}
            >
              Add to Cart
            </button>

            <button className="w-full border border-gray-300 py-4 rounded-full font-bold hover:bg-gray-50 transition text-gray-700">
              Contact Creator
            </button>
          </div>

          {/* Security / Trust Badges (Visual Polish) */}
          <div className="mt-8 pt-8 border-t border-gray-100 flex gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span>🛡️ Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🇬🇪 Made in Georgia</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
