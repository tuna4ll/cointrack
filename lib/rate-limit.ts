export interface RateLimitConfig {
  interval: number; // ms
  uniqueTokenPerInterval: number; // max users
}

export function rateLimit(options?: RateLimitConfig) {
  const tokenCache = new Map();
  const interval = options?.interval || 60000; // 1 minute default
  const limit = 10; // 10 requests per interval default

  return {
    check: (res: Response, token: string) => {
      const now = Date.now();
      const tokenCount = tokenCache.get(token) || [0];
      
      if (tokenCount[0] === 0 || (now - tokenCount[1]) > interval) {
        tokenCache.set(token, [1, now]);
      } else {
        tokenCount[0] += 1;
        tokenCache.set(token, tokenCount);
      }

      const currentUsage = tokenCache.get(token)[0];
      const isRateLimited = currentUsage >= limit;

      return {
        isRateLimited,
        remaining: isRateLimited ? 0 : limit - currentUsage,
      };
    },
  };
}

export const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500,
});
