import type { Base } from '@binary/conversion';

interface BaseSelectorProps {
  label: string;
  id: string;
  value: Base;
  onChange: (base: Base) => void;
}

const BASES: { value: Base; label: string; shortLabel: string }[] = [
  { value: 2, label: 'Binary', shortLabel: 'BIN' },
  { value: 8, label: 'Octal', shortLabel: 'OCT' },
  { value: 10, label: 'Decimal', shortLabel: 'DEC' },
  { value: 16, label: 'Hex', shortLabel: 'HEX' },
];

const BaseSelector = ({ label, id, value, onChange }: BaseSelectorProps) => {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgb(var(--color-text-secondary))' }}>
        {label}
      </legend>
      <div
        id={id}
        role="radiogroup"
        aria-label={label}
        className="inline-flex rounded-xl p-1"
        style={{ backgroundColor: 'rgb(var(--color-surface-alt))' }}
      >
        {BASES.map((base) => {
          const isActive = base.value === value;
          return (
            <button
              key={base.value}
              role="radio"
              aria-checked={isActive}
              aria-label={base.label}
              onClick={() => onChange(base.value)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'text-white shadow-sm'
                  : ''
              }`}
              style={
                isActive
                  ? { backgroundColor: 'rgb(var(--color-accent))' }
                  : { color: 'rgb(var(--color-text-secondary))' }
              }
            >
              {base.shortLabel}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
};

export default BaseSelector;
