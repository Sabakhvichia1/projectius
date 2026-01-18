// app/shop/page.tsx
"use client";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function PublicStore() {
  // Use the NEW public query
  const products = useQuery(api.products.getPublic);

  return (
    <main className="bg-white min-h-screen font-sans text-gray-900">
      {/* HEADER / HERO SECTION */}
      <header className="bg-black text-white py-12 px-6 mb-12">
        <div>
          <h1 className="font-extrabold text-3xl mb-4 text-center">
            შენს კოდს გადავხედე მალადეc კაი პროგრესია ძამი პროსტა ცოტა მეტი
            ყურადღება დაუთმე სუფთა კოდის წერას და არქიტექტურას თორე პრობლემატური
            გახდება რაღაც ეტაპზე და ჩემსავით მოგიწევს წვალება
            <h2 >
              <strong className="text-red-400">
                და რაც ერთ-ერთი ყველაცე მნიშვნელოვანია ისწავლე client side and
                server side კომპონენტებს შორის სხვაობა  {" "}
              </strong>
              მაგას რო დაამუღამებ shadcnUI-ს გადახედე და დააყენე მთელი დიზაინი მაგით მაქვს მე აწყობილი და შენც უეჭველი მოგიწევს სხვა ყველაფერი 
              ძალიან მომეწონა ყოჩაღ 
            </h2>
          </h1>
        </div>

        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight mb-2">
              Voloostore<span className="text-blue-500">.</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Handmade goods from Georgian creators.
            </p>
          </div>

          <button className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-gray-200 transition">
            Cart (0)
          </button>
        </div>
      </header>

      {/* PRODUCT GRID */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold mb-8 border-b pb-4">
          Latest Arrivals
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products?.map((product) => (
            // Wrap the card in a Link to the dynamic route
            <Link
              href={`/shop/${product._id}`}
              key={product._id}
              className="group cursor-pointer"
            >
              {/* Image Container */}
              <div className="w-full h-80 bg-gray-100 rounded-xl overflow-hidden mb-4 relative">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                {/* Visual "Quick Add" button (Doesn't function yet, just for looks) */}
                <button className="absolute bottom-4 right-4 bg-white text-black p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </button>
              </div>

              {/* Product Info */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-blue-600 transition">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {product.description}
                  </p>
                </div>
                <span className="font-bold text-lg">{product.price} ₾</span>
              </div>
            </Link>
          ))}

          {/* Loading State Skeleton */}
          {!products &&
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-80 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 w-2/3 mb-2 rounded"></div>
                <div className="h-4 bg-gray-200 w-1/4 rounded"></div>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}
