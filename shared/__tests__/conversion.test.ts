import { convert, formatGrouped, normalizeInput, validateInput } from '../src';

describe('conversion utilities', () => {
  it('normalizes input', () => {
    expect(normalizeInput('  a f ')).toBe('AF');
  });

  it('validates input and detects invalid digits', () => {
    const result = validateInput('102', 2);
    expect(result.isValid).toBe(false);
    expect(result.message).toContain('Invalid character');
  });

  it('converts binary to decimal', () => {
    const result = convert('1011', 2, 10);
    expect(result.result).toBe('11');
  });

  it('handles leading zeros', () => {
    const result = convert('000101', 2, 10);
    expect(result.result).toBe('5');
  });

  it('converts decimal to hex', () => {
    const result = convert('255', 10, 16);
    expect(result.result).toBe('FF');
  });

  it('handles large inputs', () => {
    const value = '123456789012345678901234567890';
    const result = convert(value, 10, 16);
    expect(result.result.length).toBeGreaterThan(10);
  });

  it('formats grouped binary', () => {
    expect(formatGrouped('10101010', 2)).toBe('1010 1010');
  });
});
