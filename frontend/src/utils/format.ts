import type { Base } from '@binary/conversion';

export const formatTimestamp = (timestamp: string) =>
  new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const baseLabel = (base: Base) => {
  switch (base) {
    case 2:
      return 'Binary';
    case 8:
      return 'Octal';
    case 10:
      return 'Decimal';
    case 16:
      return 'Hex';
    default:
      return `${base}`;
  }
};
