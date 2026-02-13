import type { Base } from '@binary/conversion';
import { baseLabel, formatTimestamp } from '../utils/format';

export interface HistoryItem {
  sessionId: string;
  result: string;
  steps: string[];
  meta: {
    input: string;
    fromBase: Base;
    toBase: Base;
    timestamp: string;
  };
}

interface HistoryPanelProps {
  items: HistoryItem[];
  onUse: (item: HistoryItem) => void;
  onDelete: (item: HistoryItem) => void;
  onExport: () => void;
}

const HistoryPanel = ({ items, onUse, onDelete, onExport }: HistoryPanelProps) => {
  return (
    <details className="card-interactive group" open={items.length > 0}>
      <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold">
        <span>History ({items.length})</span>
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
      <div className="mt-4">
        {items.length === 0 ? (
          <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>
            No conversions yet.
          </p>
        ) : (
          <>
            <ul className="space-y-2">
              {items.map((item) => (
                <li
                  key={`${item.meta.timestamp}-${item.meta.input}`}
                  className="flex items-center justify-between gap-3 rounded-xl p-3 transition-colors duration-100"
                  style={{ backgroundColor: 'rgb(var(--color-bg))' }}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-sm font-medium">
                      {item.meta.input}
                      <span style={{ color: 'rgb(var(--color-text-secondary))' }}> = </span>
                      {item.result}
                    </p>
                    <p className="text-xs" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                      {baseLabel(item.meta.fromBase)} → {baseLabel(item.meta.toBase)} · {formatTimestamp(item.meta.timestamp)}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => onUse(item)}
                      className="btn-icon"
                      aria-label={`Reuse conversion: ${item.meta.input}`}
                      title="Reuse"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="1 4 1 10 7 10" />
                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className="btn-icon"
                      aria-label={`Delete conversion: ${item.meta.input}`}
                      title="Delete"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={onExport}
              className="btn-secondary mt-3 w-full text-xs"
            >
              Export CSV
            </button>
          </>
        )}
      </div>
    </details>
  );
};

export default HistoryPanel;
