interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, RateLimitBucket>();

// Configuration: 60 requests per minute per IP
const LIMIT_CAPACITY = 60;
const REFILL_RATE_PER_MS = LIMIT_CAPACITY / (60 * 1000); // 1 token per second (1/1000 ms)
const CLEANUP_THRESHOLD_MS = 10 * 60 * 1000; // 10 minutes of inactivity to remove entry

// Periodically clean up stale rate-limiter buckets to avoid memory leaks
if (typeof global !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, bucket] of buckets.entries()) {
      if (now - bucket.lastRefill > CLEANUP_THRESHOLD_MS) {
        buckets.delete(ip);
      }
    }
  }, CLEANUP_THRESHOLD_MS);
}

/**
 * Checks if a request from the given IP is allowed under the rate limit
 */
export function checkRateLimit(ip: string): {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
} {
  const now = Date.now();
  let bucket = buckets.get(ip);

  if (!bucket) {
    bucket = {
      tokens: LIMIT_CAPACITY,
      lastRefill: now,
    };
    buckets.set(ip, bucket);
  } else {
    // Calculate refilled tokens since last check
    const elapsed = now - bucket.lastRefill;
    const refilled = elapsed * REFILL_RATE_PER_MS;
    bucket.tokens = Math.min(LIMIT_CAPACITY, bucket.tokens + refilled);
    bucket.lastRefill = now;
  }

  // Determine if allowed
  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return {
      allowed: true,
      limit: LIMIT_CAPACITY,
      remaining: Math.floor(bucket.tokens),
      resetSeconds: Math.ceil((LIMIT_CAPACITY - bucket.tokens) / (REFILL_RATE_PER_MS * 1000)),
    };
  }

  // Blocked
  return {
    allowed: false,
    limit: LIMIT_CAPACITY,
    remaining: 0,
    resetSeconds: Math.ceil((1 - bucket.tokens) / (REFILL_RATE_PER_MS * 1000)),
  };
}
