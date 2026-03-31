import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// 5 requests per 60 seconds per IP
export const authLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  prefix: "ratelimit:auth",
});

// 3 requests per 60 seconds per IP
export const sensitiveLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "60 s"),// jusy a algorithm
  prefix: "ratelimit:sensitive",
});

//  10 requests per 60 seconds per IP
export const uploadLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "60 s"), 
  prefix: "ratelimit:upload",
});

// Check rate limit for a request. Returns null if allowed
 // NextResponse 429 if the limit is exceeded.
export async function checkRateLimit(request, limiter = authLimiter) {
  
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous";

  const { success, remaining, reset } = await limiter.limit(ip);

  if (!success) {
    return NextResponse.json(

      { message: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      }
    );
  }

  return null; // we allow
}
