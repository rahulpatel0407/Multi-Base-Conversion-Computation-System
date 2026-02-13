import { validateInput, normalizeInput, formatGrouped, convert } from '@binary/conversion';

describe('validateInput', () => {
  it('rejects empty input', () => {
    const result = validateInput('', 2);
    expect(result.isValid).toBe(false);
    expect(result.message).toContain('enter a value');
  });

  it('accepts valid binary input', () => {
    expect(validateInput('1010', 2).isValid).toBe(true);
    expect(validateInput('0', 2).isValid).toBe(true);
    expect(validateInput('11111111', 2).isValid).toBe(true);
  });

  it('rejects invalid binary characters', () => {
    const result = validateInput('1021', 2);
    expect(result.isValid).toBe(false);
    expect(result.message).toContain('2');
  });

  it('accepts valid octal input', () => {
    expect(validateInput('377', 8).isValid).toBe(true);
    expect(validateInput('01234567', 8).isValid).toBe(true);
  });

  it('rejects invalid octal characters', () => {
    const result = validateInput('89', 8);
    expect(result.isValid).toBe(false);
  });

  it('accepts valid decimal input', () => {
    expect(validateInput('255', 10).isValid).toBe(true);
    expect(validateInput('0', 10).isValid).toBe(true);
    expect(validateInput('9999999', 10).isValid).toBe(true);
  });

  it('rejects invalid decimal characters', () => {
    const result = validateInput('12F', 10);
    expect(result.isValid).toBe(false);
  });

  it('accepts valid hex input', () => {
    expect(validateInput('FF', 16).isValid).toBe(true);
    expect(validateInput('DEADBEEF', 16).isValid).toBe(true);
    expect(validateInput('0123456789ABCDEF', 16).isValid).toBe(true);
  });

  it('rejects input that is too long', () => {
    const longInput = '1'.repeat(257);
    const result = validateInput(longInput, 2);
    expect(result.isValid).toBe(false);
    expect(result.message).toContain('too long');
  });
});

describe('normalizeInput', () => {
  it('trims whitespace', () => {
    expect(normalizeInput('  101  ')).toBe('101');
  });

  it('converts to uppercase', () => {
    expect(normalizeInput('ff')).toBe('FF');
  });

  it('removes internal spaces', () => {
    expect(normalizeInput('1010 1100')).toBe('10101100');
  });
});

describe('formatGrouped', () => {
  it('groups binary in 4-bit chunks', () => {
    expect(formatGrouped('10101100', 2)).toBe('1010 1100');
    expect(formatGrouped('1', 2)).toBe('1');
    expect(formatGrouped('11', 2)).toBe('11');
  });

  it('groups hex in 2-char pairs', () => {
    expect(formatGrouped('DEADBEEF', 16)).toBe('DE AD BE EF');
    expect(formatGrouped('FF', 16)).toBe('FF');
  });

  it('does not group decimal or octal', () => {
    expect(formatGrouped('12345', 10)).toBe('12345');
    expect(formatGrouped('377', 8)).toBe('377');
  });
});

describe('convert', () => {
  it('converts binary to decimal', () => {
    const result = convert('1010', 2, 10);
    expect(result.result).toBe('10');
    expect(result.steps.length).toBeGreaterThan(0);
  });

  it('converts decimal to binary', () => {
    const result = convert('255', 10, 2);
    expect(result.result).toBe('11111111');
  });

  it('converts binary to hex', () => {
    const result = convert('11111111', 2, 16);
    expect(result.result).toBe('FF');
  });

  it('converts hex to decimal', () => {
    const result = convert('FF', 16, 10);
    expect(result.result).toBe('255');
  });

  it('converts octal to decimal', () => {
    const result = convert('377', 8, 10);
    expect(result.result).toBe('255');
  });

  it('converts decimal to hex', () => {
    const result = convert('255', 10, 16);
    expect(result.result).toBe('FF');
  });

  it('handles zero', () => {
    const result = convert('0', 2, 10);
    expect(result.result).toBe('0');
  });

  it('provides steps for binary to decimal', () => {
    const result = convert('1010', 2, 10);
    expect(result.steps[0]).toContain('=');
  });

  it('provides division steps for decimal to binary', () => {
    const result = convert('10', 10, 2);
    expect(result.steps.some((s) => s.includes('/'))).toBe(true);
  });

  it('throws on same base', () => {
    const result = convert('10', 2, 2);
    expect(result.steps[0]).toContain('equal');
  });

  it('throws on invalid input', () => {
    expect(() => convert('', 2, 10)).toThrow();
  });
});
