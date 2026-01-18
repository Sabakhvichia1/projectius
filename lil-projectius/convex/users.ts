// convex/users.ts
import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const upsertUser = internalMutation({
  args: {
    username: v.string(),
    imageId: v.string(),
    externalId: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Check if user already exists
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", args.externalId))
      .unique();

    // 2. If yes, update them. If no, create them.
    if (user) {
      await ctx.db.patch(user._id, {
        username: args.username,
        imageId: args.imageId,
      });
    } else {
      await ctx.db.insert("users", {
        username: args.username,
        imageId: args.imageId,
        externalId: args.externalId,
      });
    }
  },
});