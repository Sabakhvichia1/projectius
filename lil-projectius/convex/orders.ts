// convex/orders.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 1. CUSTOMER: Place an Order
export const create = mutation({
  args: {
    items: v.any(), // The list of products
    total: v.number(),
    buyerName: v.string(),
  },
  handler: async (ctx, args) => {
    // In a real app, you'd verify payment here (Stripe)
    
    await ctx.db.insert("orders", {
      items: args.items,
      total: args.total,
      buyerName: args.buyerName,
      status: "new",
    });
  },
});

// 2. SELLER: Get All Orders
export const get = query({
  args: {},
  handler: async (ctx) => {
    // In the future, we would filter this by sellerId
    // For now, as the main Admin, you see everything.
    return await ctx.db.query("orders").order("desc").collect();
  },
});

// 3. SELLER: Mark as Shipped
export const markAsShipped = mutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, { status: "shipped" });
  },
});