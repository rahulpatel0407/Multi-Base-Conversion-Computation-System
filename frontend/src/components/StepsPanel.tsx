import type { Steps } from '@binary/conversion';

interface StepsPanelProps {
  steps: Steps;
  onCopy: () => void;
}

const StepsPanel = ({ steps, onCopy }: StepsPanelProps) => {
  return (
    <details className="card-interactive group">
      <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold">
        <span>How it works</span>
        <svg
          className="h-4 w-4 transition-transform duration-200 group-open:rotate-180"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: 'rgb(var(--color-text-secondary))' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </summary>
      <div className="mt-4 space-y-2">
        {steps.length === 0 ? (
          <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>
            Convert a value to see the step-by-step explanation.
          </p>
        ) : (
          <>
            <ol className="list-inside list-decimal space-y-1.5 font-mono text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>
              {steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
            <button
              onClick={onCopy}
              className="btn-secondary mt-3 text-xs"
            >
              Copy steps
            </button>
          </>
        )}
      </div>
    </details>
  );
};

export default StepsPanel;
