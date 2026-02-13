interface HeaderProps {
  onToggleTheme: () => void;
  onOpenHelp: () => void;
  themeLabel: string;
}

const Header = ({ onToggleTheme, onOpenHelp, themeLabel }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold sm:text-2xl" style={{ color: 'rgb(var(--color-text))' }}>
          Base Converter
        </h1>
        <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>
          Binary, octal, decimal &amp; hex — with steps
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={onOpenHelp}
          className="btn-icon"
          aria-label="Keyboard shortcuts"
          title="Keyboard shortcuts (?)"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10" />
          </svg>
        </button>
        <button
          onClick={onToggleTheme}
          className="btn-icon"
          aria-label={themeLabel}
          title={themeLabel}
        >
          {themeLabel === 'Dark mode' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
