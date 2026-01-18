// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    imageId: v.string(),
    externalId: v.string(),
  }).index("byExternalId", ["externalId"]),

  products: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
    sku: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")), // <--- NEW FIELD
    userId: v.string(),
  }).index("by_user", ["userId"]),

  orders: defineTable({
    items: v.any(),
    total: v.number(),
    buyerName: v.string(),
    status: v.string(),
  })
});
