import { maskString, maskObject } from '../hipaa';

describe('maskString', () => {
  it('redacts SSNs', () => {
    expect(maskString('SSN: 123-45-6789')).not.toContain('123-45-6789');
  });

  it('redacts phone numbers', () => {
    expect(maskString('Call 215-555-0123 for help')).not.toContain('215-555-0123');
  });

  it('redacts email addresses', () => {
    expect(maskString('Contact john.doe@example.com')).not.toContain('john.doe@example.com');
  });

  it('redacts dates of birth', () => {
    expect(maskString('DOB: 01/15/1985')).not.toContain('01/15/1985');
  });

  it('redacts IP addresses', () => {
    expect(maskString('IP: 192.168.1.100')).not.toContain('192.168.1.100');
  });

  it('passes through safe strings unchanged', () => {
    const safe = 'Loading providers near you...';
    expect(maskString(safe)).toBe(safe);
  });

  it('handles empty string', () => {
    expect(maskString('')).toBe('');
  });
});

describe('maskObject', () => {
  it('redacts sensitive key names regardless of value', () => {
    const obj = { name: 'John Smith', status: 'active' };
    const result = maskObject(obj) as any;
    expect(result.name).toBe('[REDACTED]');
    expect(result.status).toBe('active');
  });

  it('redacts memberId', () => {
    const result = maskObject({ memberId: 'MBR001234' }) as any;
    expect(result.memberId).toBe('[REDACTED]');
  });

  it('redacts token fields', () => {
    const result = maskObject({ accessToken: 'eyJhbGc...', userId: 'u123' }) as any;
    expect(result.accessToken).toBe('[REDACTED]');
    expect(result.userId).toBe('[REDACTED]');
  });

  it('deep-scrubs nested objects', () => {
    const obj = { member: { name: 'Jane', plan: 'Gold' } };
    const result = maskObject(obj) as any;
    expect(result.member.name).toBe('[REDACTED]');
    expect(result.member.plan).toBe('Gold');
  });

  it('scrubs PHI patterns from safe-key string values', () => {
    const obj = { message: 'Contact 215-555-0123 for support' };
    const result = maskObject(obj) as any;
    expect(result.message).not.toContain('215-555-0123');
  });

  it('handles arrays', () => {
    const result = maskObject([{ name: 'Alice' }, { name: 'Bob' }]) as any[];
    expect(result[0].name).toBe('[REDACTED]');
    expect(result[1].name).toBe('[REDACTED]');
  });

  it('passes through primitives', () => {
    expect(maskObject(42)).toBe(42);
    expect(maskObject(true)).toBe(true);
    expect(maskObject(null)).toBe(null);
  });

  it('caps recursion depth', () => {
    const deep: any = {};
    let cur = deep;
    for (let i = 0; i < 10; i++) { cur.child = {}; cur = cur.child; }
    cur.name = 'phi';
    // Should not throw regardless of depth
    expect(() => maskObject(deep)).not.toThrow();
  });
});
