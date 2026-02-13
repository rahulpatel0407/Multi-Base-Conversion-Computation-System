export type Base = 2 | 8 | 10 | 16;
export type Steps = string[];

const DIGITS = '0123456789ABCDEF';
const MAX_LENGTH = 256;

export interface ConvertResult {
  result: string;
  steps: Steps;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export const isAllowedBase = (base: number): base is Base =>
  base === 2 || base === 8 || base === 10 || base === 16;

export const normalizeInput = (value: string): string =>
  value.trim().toUpperCase().replace(/\s+/g, '');

export const validateInput = (value: string, base: Base): ValidationResult => {
  if (!value) {
    return { isValid: false, message: 'Please enter a value to convert.' };
  }

  if (!isAllowedBase(base)) {
    return { isValid: false, message: 'Invalid base selection.' };
  }

  if (value.length > MAX_LENGTH) {
    return {
      isValid: false,
      message: `Input is too long. Max length is ${MAX_LENGTH}.`,
    };
  }

  const allowed = DIGITS.slice(0, base);
  const invalidChar = value.split('').find((char) => !allowed.includes(char));
  if (invalidChar) {
    return {
      isValid: false,
      message: `Invalid character: ${invalidChar} in base ${base}.`,
    };
  }

  return { isValid: true };
};

const toDecimalBigInt = (value: string, base: Base): bigint => {
  const digits = value.split('').map((char) => BigInt(DIGITS.indexOf(char)));
  const baseBig = BigInt(base);
  return digits.reduce((acc, digit) => acc * baseBig + digit, 0n);
};

const fromDecimalBigInt = (value: bigint, base: Base): string => {
  if (value === 0n) {
    return '0';
  }

  const baseBig = BigInt(base);
  let current = value;
  let out = '';

  while (current > 0n) {
    const remainder = current % baseBig;
    out = DIGITS[Number(remainder)] + out;
    current /= baseBig;
  }

  return out;
};

const stepsFromPositional = (value: string, base: Base): Steps => {
  const digits = value.split('');
  const powers = digits.length - 1;
  const expanded = digits
    .map((digit, index) => `${digit}×${base}^${powers - index}`)
    .join(' + ');
  const decimal = toDecimalBigInt(value, base).toString();
  return [`${expanded} = ${decimal}`];
};

const stepsFromDecimalDivision = (value: string, base: Base): Steps => {
  const decimal = BigInt(value);
  if (decimal === 0n) {
    return ['0 converts to 0 in any base.'];
  }

  const steps: Steps = [];
  let current = decimal;
  const baseBig = BigInt(base);

  while (current > 0n) {
    const quotient = current / baseBig;
    const remainder = current % baseBig;
    steps.push(
      `${current.toString()} / ${base} = ${quotient.toString()} rem ${DIGITS[Number(remainder)]}`,
    );
    current = quotient;
  }

  steps.push(`Read remainders bottom to top -> ${fromDecimalBigInt(decimal, base)}`);
  return steps;
};

export const convert = (value: string, fromBase: Base, toBase: Base): ConvertResult => {
  const normalized = normalizeInput(value);
  const validation = validateInput(normalized, fromBase);
  if (!validation.isValid) {
    throw new Error(validation.message || 'Invalid input');
  }

  if (!isAllowedBase(toBase)) {
    throw new Error('Invalid target base.');
  }

  if (fromBase === toBase) {
    return { result: normalized || '0', steps: ['Source and target bases are equal.'] };
  }

  const decimalValue = toDecimalBigInt(normalized, fromBase);
  const result = fromDecimalBigInt(decimalValue, toBase);

  let steps: Steps = [];
  if (fromBase === 10) {
    steps = stepsFromDecimalDivision(normalized, toBase);
  } else if (toBase === 10) {
    steps = stepsFromPositional(normalized, fromBase);
  } else {
    const toDecimalSteps = stepsFromPositional(normalized, fromBase)[0];
    const toTargetSteps = stepsFromDecimalDivision(decimalValue.toString(), toBase);
    steps = [toDecimalSteps, ...toTargetSteps];
  }

  return { result, steps };
};

export const formatGrouped = (value: string, base: Base): string => {
  if (base === 2) {
    return value.replace(/(.)(?=(.{4})+$)/g, '$1 ').trim();
  }
  if (base === 16) {
    return value.replace(/(.)(?=(.{2})+$)/g, '$1 ').trim();
  }
  return value;
};
