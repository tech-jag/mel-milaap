// Client-side rate limiting helpers
// Note: This provides basic client-side protection, but server-side rate limiting is handled by Supabase

interface RateLimitRule {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs?: number;
}

interface RateLimitEntry {
  attempts: number;
  firstAttempt: number;
  blockedUntil?: number;
}

class ClientRateLimiter {
  private storage = new Map<string, RateLimitEntry>();
  private storageKey = 'melmilaap_rate_limits';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.storage = new Map(Object.entries(data));
      }
    } catch (error) {
      console.warn('Failed to load rate limit data from storage');
    }
  }

  private saveToStorage() {
    try {
      const data = Object.fromEntries(this.storage);
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save rate limit data to storage');
    }
  }

  private cleanupExpired() {
    const now = Date.now();
    for (const [key, entry] of this.storage.entries()) {
      if (entry.blockedUntil && entry.blockedUntil < now) {
        this.storage.delete(key);
      }
    }
    this.saveToStorage();
  }

  isRateLimited(key: string, rule: RateLimitRule): { limited: boolean; remainingTime?: number; message?: string } {
    this.cleanupExpired();
    
    const now = Date.now();
    const entry = this.storage.get(key);

    if (!entry) {
      return { limited: false };
    }

    // Check if currently blocked
    if (entry.blockedUntil && entry.blockedUntil > now) {
      const remainingTime = Math.ceil((entry.blockedUntil - now) / 1000);
      return {
        limited: true,
        remainingTime,
        message: `Please wait ${remainingTime} seconds before trying again`
      };
    }

    // Check if within rate limit window
    const windowStart = now - rule.windowMs;
    if (entry.firstAttempt > windowStart && entry.attempts >= rule.maxAttempts) {
      const blockDuration = rule.blockDurationMs || rule.windowMs;
      const blockedUntil = now + blockDuration;
      
      this.storage.set(key, {
        ...entry,
        blockedUntil
      });
      this.saveToStorage();

      const remainingTime = Math.ceil(blockDuration / 1000);
      return {
        limited: true,
        remainingTime,
        message: `Too many attempts. Please wait ${remainingTime} seconds before trying again`
      };
    }

    return { limited: false };
  }

  recordAttempt(key: string, rule: RateLimitRule): void {
    this.cleanupExpired();
    
    const now = Date.now();
    const entry = this.storage.get(key);
    const windowStart = now - rule.windowMs;

    if (!entry || entry.firstAttempt < windowStart) {
      // Start new window
      this.storage.set(key, {
        attempts: 1,
        firstAttempt: now
      });
    } else {
      // Increment attempts in current window
      this.storage.set(key, {
        ...entry,
        attempts: entry.attempts + 1
      });
    }

    this.saveToStorage();
  }

  reset(key: string): void {
    this.storage.delete(key);
    this.saveToStorage();
  }
}

// Rate limiting rules
export const RATE_LIMITS = {
  LOGIN: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 15 * 60 * 1000 // 15 minutes
  },
  SIGNUP: {
    maxAttempts: 10,
    windowMs: 5 * 60 * 1000, // 5 minutes
    blockDurationMs: 30 * 1000 // 30 seconds
  },
  PASSWORD_RESET: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    blockDurationMs: 60 * 60 * 1000 // 1 hour
  },
  SEARCH: {
    maxAttempts: 100,
    windowMs: 60 * 60 * 1000, // 1 hour
    blockDurationMs: 10 * 60 * 1000 // 10 minutes
  },
  MESSAGING: {
    maxAttempts: 50,
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    blockDurationMs: 60 * 60 * 1000 // 1 hour
  }
} as const;

// Create singleton instance
export const rateLimiter = new ClientRateLimiter();

// Helper functions for common actions
export const checkLoginRateLimit = () => {
  const key = `login_${getClientIP()}`;
  return rateLimiter.isRateLimited(key, RATE_LIMITS.LOGIN);
};

export const recordLoginAttempt = () => {
  const key = `login_${getClientIP()}`;
  rateLimiter.recordAttempt(key, RATE_LIMITS.LOGIN);
};

export const checkSignupRateLimit = () => {
  const key = `signup_${getClientIP()}`;
  return rateLimiter.isRateLimited(key, RATE_LIMITS.SIGNUP);
};

export const recordSignupAttempt = () => {
  const key = `signup_${getClientIP()}`;
  rateLimiter.recordAttempt(key, RATE_LIMITS.SIGNUP);
};

export const checkPasswordResetRateLimit = (email: string) => {
  const key = `password_reset_${email}`;
  return rateLimiter.isRateLimited(key, RATE_LIMITS.PASSWORD_RESET);
};

export const recordPasswordResetAttempt = (email: string) => {
  const key = `password_reset_${email}`;
  rateLimiter.recordAttempt(key, RATE_LIMITS.PASSWORD_RESET);
};

// Simple client IP detection (not foolproof but provides basic protection)
function getClientIP(): string {
  // This is a basic client-side identifier
  // In production, you'd want server-side IP detection
  return 'client_' + (navigator.userAgent + navigator.language).split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
}

// Security logging function
export const logSecurityEvent = (event: string, details: Record<string, any> = {}) => {
  // In production, send to your security monitoring service
  console.warn(`[SECURITY] ${event}:`, details);
  
  // Store security events locally for analysis
  try {
    const securityLog = localStorage.getItem('security_log') || '[]';
    const events = JSON.parse(securityLog);
    events.push({
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href
    });
    
    // Keep only last 100 events
    if (events.length > 100) {
      events.splice(0, events.length - 100);
    }
    
    localStorage.setItem('security_log', JSON.stringify(events));
  } catch (error) {
    console.warn('Failed to log security event');
  }
};
