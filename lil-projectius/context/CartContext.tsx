// context/CartContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Id } from "../convex/_generated/dataModel";

// 1. Define what an Item looks like in the cart
export type CartItem = {
  productId: Id<"products">;
  name: string;
  price: number;
  imageUrl: string | null;
};

// 2. Define what the Context provides
type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  cartCount: number;
  cartTotal: number;
  clearCart: () => void; // <--- Add this type
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// 3. The Provider Component
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const clearCart = () => {
    setItems([]);
  };
  const addToCart = (item: CartItem) => {
    // Simple logic: Add to array (you can add logic to prevent duplicates later)
    setItems((prev) => [...prev, item]);
    alert(`Added ${item.name} to cart!`); // Temporary feedback
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  // Derived state
  const cartCount = items.length;
  const cartTotal = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, cartCount, cartTotal, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

// 4. Custom Hook for easy access
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}