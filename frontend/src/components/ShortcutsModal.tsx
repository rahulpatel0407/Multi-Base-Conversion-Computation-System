import { useEffect, useRef } from 'react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { keys: ['Enter'], description: 'Convert' },
  { keys: ['Ctrl', 'K'], description: 'Focus input' },
  { keys: ['Alt', '\u2190/\u2192'], description: 'Change from-base' },
  { keys: ['?'], description: 'Toggle this modal' },
  { keys: ['Esc'], description: 'Close modal' },
];

const ShortcutsModal = ({ isOpen, onClose }: ShortcutsModalProps) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKey);
    closeRef.current?.focus();

    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
    >
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgb(0 0 0 / 0.4)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
      <div
        className="card animate-fade-in relative z-10 w-full max-w-sm"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Keyboard Shortcuts</h2>
          <button
            ref={closeRef}
            onClick={onClose}
            className="btn-icon"
            aria-label="Close shortcuts"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <ul className="space-y-3">
          {SHORTCUTS.map((shortcut) => (
            <li key={shortcut.description} className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                {shortcut.description}
              </span>
              <span className="flex gap-1">
                {shortcut.keys.map((key) => (
                  <kbd
                    key={key}
                    className="inline-block rounded-md px-2 py-0.5 text-xs font-semibold"
                    style={{
                      backgroundColor: 'rgb(var(--color-surface-alt))',
                      border: '1px solid rgb(var(--color-border))',
                      color: 'rgb(var(--color-text))',
                    }}
                  >
                    {key}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ShortcutsModal;
