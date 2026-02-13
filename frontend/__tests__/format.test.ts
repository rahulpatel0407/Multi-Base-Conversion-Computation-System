import { baseLabel, formatTimestamp } from '../src/utils/format';

describe('baseLabel', () => {
  it('returns Binary for base 2', () => {
    expect(baseLabel(2)).toBe('Binary');
  });

  it('returns Octal for base 8', () => {
    expect(baseLabel(8)).toBe('Octal');
  });

  it('returns Decimal for base 10', () => {
    expect(baseLabel(10)).toBe('Decimal');
  });

  it('returns Hex for base 16', () => {
    expect(baseLabel(16)).toBe('Hex');
  });
});

describe('formatTimestamp', () => {
  it('formats a valid ISO timestamp', () => {
    const result = formatTimestamp('2024-01-15T14:30:00.000Z');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });
});
