type LogLevel = 'info' | 'warn' | 'error';

const IS_PROD = process.env.NODE_ENV === 'production';

// Common sensitive key patterns to redact
const SENSITIVE_KEYS = [
  /api[-_]?key/i,
  /token/i,
  /password/i,
  /secret/i,
  /database[-_]?url/i,
  /auth/i,
];

/**
 * Recursively redacts sensitive keys and values from objects
 */
function sanitize(obj: any): any {
  if (!obj || typeof obj !== 'object') {
    if (typeof obj === 'string') {
      // Redact potential connection strings containing passwords
      if (obj.includes('mysql://') || obj.includes('postgres://') || obj.includes('libsql://')) {
        return '[REDACTED_CONNECTION_STRING]';
      }
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitize);
  }

  const sanitized: Record<string, any> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const isSensitive = SENSITIVE_KEYS.some((regex) => regex.test(key));
      if (isSensitive) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitize(obj[key]);
      }
    }
  }
  return sanitized;
}

/**
 * Standardized logging logic
 */
function log(level: LogLevel, message: string, meta?: any) {
  const timestamp = new Date().toISOString();

  // If metadata is an Error, extract message and stack (only for dev)
  let cleanMeta = meta;
  if (meta instanceof Error) {
    cleanMeta = {
      name: meta.name,
      message: meta.message,
      stack: IS_PROD ? undefined : meta.stack, // Strip stack trace in production to prevent exposure
    };
  } else {
    cleanMeta = sanitize(meta);
  }

  const logPayload = {
    timestamp,
    level,
    message,
    ...(cleanMeta ? { meta: cleanMeta } : {}),
  };

  if (IS_PROD) {
    // In production, print single-line structured JSON
    console.log(JSON.stringify(logPayload));
  } else {
    // In development, print human-readable formats
    const color = level === 'error' ? '\x1b[31m' : level === 'warn' ? '\x1b[33m' : '\x1b[36m';
    const reset = '\x1b[0m';
    console.log(
      `[${timestamp}] ${color}${level.toUpperCase()}${reset}: ${message}`,
      meta ? '\n' + JSON.stringify(cleanMeta, null, 2) : ''
    );
  }
}

export const logger = {
  info: (message: string, meta?: any) => log('info', message, meta),
  warn: (message: string, meta?: any) => log('warn', message, meta),
  error: (message: string, meta?: any) => log('error', message, meta),
};
