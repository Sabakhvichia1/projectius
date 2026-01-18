// convex/clerk.ts
"use node"; // Use Node.js runtime for Svix compatibility

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { Webhook } from "svix";

export const fulfill = internalAction({
  args: { headers: v.any(), payload: v.string() },
  handler: async (ctx, args) => {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET as string);
    const payload = wh.verify(args.payload, args.headers) as any;
    return payload; // Returns the verified JSON data
  },
});