// convex/products.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 1. NEW: Generate an Upload URL
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// 2. UPDATED: Get Products (now with Image URLs)
export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const products = await ctx.db
      .query("products")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();

    // Map over products to generate the Image URL
    return await Promise.all(
      products.map(async (product) => {
        return {
          ...product,
          // If storageId exists, convert it to a URL. Otherwise null.
          imageUrl: product.storageId
            ? await ctx.storage.getUrl(product.storageId)
            : null,
        };
      })
    );
  },
});

// 3. UPDATED: Create Product (accepts storageId)
export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.number(),
    storageId: v.optional(v.id("_storage")), // <--- Accept the ID
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    await ctx.db.insert("products", {
      name: args.name,
      description: args.description,
      price: args.price,
      storageId: args.storageId, // <--- Save the ID
      userId: identity.subject,
    });
  },


});

// 3. DELETE Product (and its image)
export const deleteProduct = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // 1. Get the product first (to check for an image)
    const product = await ctx.db.get(args.productId);
    
    // Security: Does this product exist and belong to this user?
    if (!product || product.userId !== identity.subject) {
      throw new Error("Product not found or access denied");
    }

    // 2. If it has an image, delete the file from storage
    if (product.storageId) {
      await ctx.storage.delete(product.storageId);
    }

    // 3. Delete the database record
    await ctx.db.delete(args.productId);
  },
});

// 4. PUBLIC: Get All Products (For the Storefront)
export const getPublic = query({
  args: {},
  handler: async (ctx) => {
    // Note: We are NOT checking ctx.auth.getUserIdentity() here.
    // This allows anyone on the internet to see the products.

    const products = await ctx.db
      .query("products")
      .order("desc") // Newest items first
      .take(50);     // Limit to 50 for now (good practice)

    return await Promise.all(
      products.map(async (product) => {
        return {
          ...product,
          imageUrl: product.storageId
            ? await ctx.storage.getUrl(product.storageId)
            : null,
        };
      })
    );
  },
});
export const getById = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    
    if (!product) {
      return null;
    }

    // Generate the image URL before returning
    return {
      ...product,
      imageUrl: product.storageId
        ? await ctx.storage.getUrl(product.storageId)
        : null,
    };
  },
});