import type { RefObject } from 'react';
import type { Base } from '@binary/conversion';
import BaseSelector from './BaseSelector';

interface ConverterCardProps {
  value: string;
  fromBase: Base;
  toBase: Base;
  error: string;
  onChangeValue: (value: string) => void;
  onChangeFromBase: (base: Base) => void;
  onChangeToBase: (base: Base) => void;
  onConvert: () => void;
  onSwap: () => void;
  onClear: () => void;
  canConvert: boolean;
  inputRef: RefObject<HTMLInputElement>;
}

const BASE_PLACEHOLDERS: Record<Base, string> = {
  2: 'e.g. 1010 1100',
  8: 'e.g. 377',
  10: 'e.g. 255',
  16: 'e.g. FF',
};

const ConverterCard = ({
  value,
  fromBase,
  toBase,
  error,
  onChangeValue,
  onChangeFromBase,
  onChangeToBase,
  onConvert,
  onSwap,
  onClear,
  canConvert,
  inputRef,
}: ConverterCardProps) => {
  return (
    <section className="card">
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-end gap-4">
          <BaseSelector
            label="From"
            id="from-base"
            value={fromBase}
            onChange={onChangeFromBase}
          />
          <button
            onClick={onSwap}
            className="btn-icon mb-0.5"
            aria-label="Swap bases"
            title="Swap from/to bases"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 16V4m0 0L3 8m4-4l4 4" />
              <path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
          <BaseSelector
            label="To"
            id="to-base"
            value={toBase}
            onChange={onChangeToBase}
          />
        </div>

        <div>
          <label
            htmlFor="value-input"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'rgb(var(--color-text-secondary))' }}
          >
            Value
          </label>
          <div className="flex gap-2">
            <input
              id="value-input"
              aria-label="Value to convert"
              value={value}
              onChange={(e) => onChangeValue(e.target.value)}
              ref={inputRef}
              className={`input-field font-mono ${error ? 'input-error' : ''}`}
              placeholder={BASE_PLACEHOLDERS[fromBase]}
              autoComplete="off"
              spellCheck={false}
            />
            {value && (
              <button
                onClick={onClear}
                className="btn-secondary shrink-0"
                aria-label="Clear input"
              >
                Clear
              </button>
            )}
          </div>
          {error && (
            <p
              role="alert"
              aria-live="polite"
              className="mt-2 text-sm font-medium"
              style={{ color: 'rgb(var(--color-error))' }}
            >
              {error}
            </p>
          )}
        </div>

        <button
          onClick={onConvert}
          disabled={!canConvert}
          className="btn-primary w-full sm:w-auto"
        >
          Convert
        </button>
      </div>
    </section>
  );
};

export default ConverterCard;
