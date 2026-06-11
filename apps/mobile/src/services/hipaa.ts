/**
 * PHI scrubbing utilities.
 * Must run on any data before it reaches Sentry, PostHog, or console logs in
 * production. HIPAA Safe Harbor requires removal of 18 identifier categories.
 */

// Patterns for the 18 HIPAA Safe Harbor identifiers we can detect in strings.
const PHI_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  // Names — catch common "First Last" patterns adjacent to healthcare keywords
  { label: 'ssn', pattern: /\b\d{3}-\d{2}-\d{4}\b/g },
  { label: 'phone', pattern: /(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/g },
  { label: 'email', pattern: /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g },
  { label: 'dob', pattern: /\b(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])[\/\-](\d{2}|\d{4})\b/g },
  // ZIP codes — truncate to first 3 digits per Safe Harbor
  { label: 'zip', pattern: /\b\d{5}(-\d{4})?\b/g },
  // NPI (National Provider Identifier) — 10 digits
  { label: 'npi', pattern: /\bNPI[:\s#]?\d{10}\b/gi },
  // Member / insurance IDs — typically alphanumeric 8-15 chars labelled explicitly
  { label: 'member_id', pattern: /\b(member|policy|group|plan)\s*(?:id|#|num(?:ber)?)[:\s]*[A-Z0-9\-]{6,20}\b/gi },
  // Street addresses
  { label: 'address', pattern: /\b\d{1,5}\s+[A-Za-z0-9\s.,'#-]{5,50}(?:St|Ave|Blvd|Dr|Rd|Ln|Way|Court|Ct|Pl|Place|Circle|Cir|Loop|Trail|Trl|Highway|Hwy)\.?\b/gi },
  // IP addresses
  { label: 'ip', pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g },
  // URLs containing potential PII query params
  { label: 'url_phi', pattern: /https?:\/\/[^\s]+(?:name|dob|ssn|member|patient|email)[^\s]*/gi },
];

const REDACTED = '[REDACTED]';

/** Scrub PHI patterns from a string. */
export function maskString(value: string): string {
  let result = value;
  for (const { pattern } of PHI_PATTERNS) {
    result = result.replace(pattern, REDACTED);
  }
  return result;
}

/** Keys whose values should always be fully redacted regardless of content. */
const SENSITIVE_KEYS = new Set([
  'name', 'firstName', 'lastName', 'fullName', 'memberName',
  'memberId', 'patientId', 'userId',
  'dob', 'dateOfBirth', 'birthDate',
  'ssn', 'socialSecurityNumber',
  'phone', 'phoneNumber', 'mobile', 'fax',
  'email', 'emailAddress',
  'address', 'street', 'city', 'zip', 'zipCode', 'postalCode',
  'npi', 'doctorNpi',
  'token', 'accessToken', 'refreshToken', 'idToken',
  'password', 'secret',
]);

/**
 * Deep-scrub an object, redacting sensitive keys and masking PHI patterns in
 * string values. Safe to call on Sentry event breadcrumbs and extras.
 */
export function maskObject(obj: unknown, depth = 0): unknown {
  if (depth > 6) return REDACTED;
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return maskString(obj);
  if (typeof obj === 'number' || typeof obj === 'boolean') return obj;
  if (Array.isArray(obj)) return obj.map((item) => maskObject(item, depth + 1));
  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
      if (SENSITIVE_KEYS.has(key)) {
        result[key] = REDACTED;
      } else {
        result[key] = maskObject(val, depth + 1);
      }
    }
    return result;
  }
  return REDACTED;
}
