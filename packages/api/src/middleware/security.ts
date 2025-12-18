import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";

// Rate limiting with in-memory store (use Redis in production)
interface RateLimitStore {
  [ip: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 500; // 500 requests per minute (increased for dashboard)

/**
 * Rate limiting middleware
 * Limits requests per IP address to prevent abuse
 */
export const rateLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();

  if (!rateLimitStore[ip] || now > rateLimitStore[ip].resetTime) {
    rateLimitStore[ip] = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    };
  } else {
    rateLimitStore[ip].count++;
  }

  const remaining = RATE_LIMIT_MAX_REQUESTS - rateLimitStore[ip].count;
  const resetTime = Math.ceil((rateLimitStore[ip].resetTime - now) / 1000);

  // Add rate limit headers
  res.setHeader("X-RateLimit-Limit", RATE_LIMIT_MAX_REQUESTS.toString());
  res.setHeader("X-RateLimit-Remaining", Math.max(0, remaining).toString());
  res.setHeader("X-RateLimit-Reset", resetTime.toString());

  if (rateLimitStore[ip].count > RATE_LIMIT_MAX_REQUESTS) {
    logger.warn(`Rate limit exceeded for IP: ${ip}`);
    res.status(429).json({
      success: false,
      error: "Too many requests, please try again later",
      retryAfter: resetTime,
    });
    return;
  }

  next();
};

/**
 * Security headers middleware
 * Adds various security-related HTTP headers
 */
export const securityHeaders = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");

  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // XSS Protection (legacy, but still useful for older browsers)
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Strict Transport Security (in production with HTTPS)
  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }

  // Referrer Policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions Policy (restrict browser features)
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()"
  );

  next();
};

/**
 * Input sanitization middleware
 * Sanitizes common XSS attack vectors in request body
 */
export const sanitizeInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeObject(req.body);
  }
  next();
};

/**
 * Recursively sanitize object properties
 */
function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === "string"
          ? sanitizeString(item)
          : typeof item === "object" && item !== null
            ? sanitizeObject(item as Record<string, unknown>)
            : item
      );
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Sanitize a string by escaping dangerous characters
 */
function sanitizeString(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Request logging middleware
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.socket.remoteAddress,
    };

    if (res.statusCode >= 400) {
      logger.warn("Request error:", logData);
    } else if (duration > 1000) {
      logger.warn("Slow request:", logData);
    }
  });

  next();
};

// Cleanup old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const ip in rateLimitStore) {
    if (now > rateLimitStore[ip].resetTime) {
      delete rateLimitStore[ip];
    }
  }
}, RATE_LIMIT_WINDOW_MS);

export default {
  rateLimiter,
  securityHeaders,
  sanitizeInput,
  requestLogger,
};
