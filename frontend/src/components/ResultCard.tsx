interface ResultCardProps {
  result: string;
  onCopy: () => void;
  onShare: () => void;
}

const ResultCard = ({ result, onCopy, onShare }: ResultCardProps) => {
  const hasResult = !!result;

  return (
    <div
      className="card"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p
            className="mb-1 text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'rgb(var(--color-text-secondary))' }}
          >
            Result
          </p>
          <p
            className={`break-all font-mono text-2xl font-bold tracking-wide ${hasResult ? 'animate-fade-in' : ''}`}
            style={{ color: hasResult ? 'rgb(var(--color-text))' : 'rgb(var(--color-text-secondary))' }}
          >
            {result || '\u2014'}
          </p>
        </div>
        {hasResult && (
          <div className="flex shrink-0 gap-1">
            <button
              onClick={onCopy}
              className="btn-icon"
              aria-label="Copy result"
              title="Copy result"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
            <button
              onClick={onShare}
              className="btn-icon"
              aria-label="Copy permalink"
              title="Copy permalink"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;
