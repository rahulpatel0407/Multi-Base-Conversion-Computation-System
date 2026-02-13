import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Base,
  convert,
  formatGrouped,
  normalizeInput,
  validateInput,
} from '@binary/conversion';
import Header from './components/Header';
import ConverterCard from './components/ConverterPanel';
import ResultCard from './components/ResultCard';
import HistoryPanel, { HistoryItem } from './components/HistoryList';
import ShortcutsModal from './components/ShortcutsModal';
import Toast from './components/Toast';
import { apiFetch } from './utils/api';

const StepsPanel = lazy(() => import('./components/StepsPanel'));

const BASES: Base[] = [2, 8, 10, 16];
const SESSION_KEY = 'converter_session';
const THEME_KEY = 'converter_theme';

const createSessionId = () => {
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const newId = crypto.randomUUID();
  localStorage.setItem(SESSION_KEY, newId);
  return newId;
};

const App = () => {
  const [value, setValue] = useState('');
  const [fromBase, setFromBase] = useState<Base>(2);
  const [toBase, setToBase] = useState<Base>(10);
  const [result, setResult] = useState('');
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [toast, setToast] = useState('');
  const [toastExiting, setToastExiting] = useState(false);
  const [theme, setTheme] = useState('light');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [shouldAutoConvert, setShouldAutoConvert] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const sessionId = useMemo(createSessionId, []);

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY) || 'light';
    setTheme(stored);
    document.documentElement.classList.toggle('dark', stored === 'dark');
  }, []);

  const showToast = useCallback((message: string) => {
    clearTimeout(toastTimer.current);
    setToastExiting(false);
    setToast(message);
    toastTimer.current = setTimeout(() => {
      setToastExiting(true);
      setTimeout(() => { setToast(''); setToastExiting(false); }, 200);
    }, 1800);
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      const data = await apiFetch<HistoryItem[]>(`/api/history?sessionId=${sessionId}`);
      setHistory(data);
      setIsOffline(false);
    } catch {
      const cached = localStorage.getItem('local_history');
      if (cached) setHistory(JSON.parse(cached));
      setIsOffline(true);
    }
  }, [sessionId]);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get('v');
    const fb = params.get('fb');
    const tb = params.get('tb');
    if (v && fb && tb) {
      setValue(normalizeInput(v));
      setFromBase(Number(fb) as Base);
      setToBase(Number(tb) as Base);
      setShouldAutoConvert(true);
    }
  }, []);

  const canConvert = useMemo(() => {
    return validateInput(value, fromBase).isValid && fromBase !== toBase;
  }, [value, fromBase, toBase]);

  const handleValueChange = (nextValue: string) => {
    const normalized = normalizeInput(nextValue);
    const allowedDigits = '0123456789ABCDEF'.slice(0, fromBase);
    const filtered = normalized
      .split('')
      .filter((char) => allowedDigits.includes(char))
      .join('');
    setValue(filtered);
    if (!filtered) { setError(''); return; }
    const validation = validateInput(filtered, fromBase);
    setError(validation.isValid ? '' : validation.message || 'Invalid input');
  };

  useEffect(() => {
    if (!value) return;
    handleValueChange(value);
  }, [fromBase]);

  const handleConvert = async () => {
    const validation = validateInput(value, fromBase);
    if (!validation.isValid) {
      setError(validation.message || 'Invalid input');
      return;
    }

    try {
      const response = await apiFetch<{ result: string; steps: string[] }>(
        '/api/convert',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value, fromBase, toBase }),
        },
      );

      const formatted = formatGrouped(response.result, toBase);
      setResult(formatted);
      setSteps(response.steps);
      setError('');
      setIsOffline(false);

      const historyItem: HistoryItem = {
        sessionId,
        result: formatted,
        steps: response.steps,
        meta: { input: value, fromBase, toBase, timestamp: new Date().toISOString() },
      };

      setHistory((prev) => {
        const updated = [historyItem, ...prev].slice(0, 10);
        localStorage.setItem('local_history', JSON.stringify(updated));
        return updated;
      });

      apiFetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId, value, fromBase, toBase,
          result: response.result, steps: response.steps,
        }),
      }).catch(() => {});
    } catch {
      try {
        const localResult = convert(value, fromBase, toBase);
        const formatted = formatGrouped(localResult.result, toBase);
        setResult(formatted);
        setSteps(localResult.steps);
        setError('');
        setIsOffline(true);
        showToast('Offline — converted locally');
      } catch {
        setError('Unable to convert the provided value.');
      }
    }

    const params = new URLSearchParams({ v: value, fb: String(fromBase), tb: String(toBase) });
    window.history.replaceState({}, '', `?${params.toString()}`);
  };

  useEffect(() => {
    if (shouldAutoConvert && value) {
      handleConvert();
      setShouldAutoConvert(false);
    }
  }, [shouldAutoConvert, value]);

  const handleSwap = () => { setFromBase(toBase); setToBase(fromBase); };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    showToast('Copied to clipboard');
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    showToast('Permalink copied');
  };

  const handleClear = () => {
    setValue(''); setResult(''); setSteps([]); setError('');
  };

  const handleStepsCopy = async () => {
    await navigator.clipboard.writeText(steps.join('\n'));
    showToast('Steps copied');
  };

  const handleHistoryUse = (item: HistoryItem) => {
    setValue(item.meta.input);
    setFromBase(item.meta.fromBase);
    setToBase(item.meta.toBase);
    setResult(item.result);
    setSteps(item.steps);
  };

  const handleHistoryDelete = (item: HistoryItem) => {
    const updated = history.filter((e) => e.meta.timestamp !== item.meta.timestamp);
    setHistory(updated);
    localStorage.setItem('local_history', JSON.stringify(updated));
  };

  const handleHistoryExport = () => {
    const rows = history.map((item) =>
      `${item.meta.timestamp},${item.meta.input},${item.meta.fromBase},${item.meta.toBase},${item.result}`,
    );
    const csv = ['timestamp,input,fromBase,toBase,result', ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'conversion-history.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if (event.key === '?' || (event.shiftKey && event.key === '/')) {
        event.preventDefault();
        setIsHelpOpen((prev) => !prev);
      }
      if (event.key === 'Enter' && canConvert) {
        handleConvert();
      }
      const shouldHandleArrows = event.altKey || (event.target !== inputRef.current && !event.metaKey);
      if (shouldHandleArrows && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
        const direction = event.key === 'ArrowLeft' ? -1 : 1;
        const nextIndex = (BASES.indexOf(fromBase) + direction + BASES.length) % BASES.length;
        setFromBase(BASES[nextIndex]);
      }
    },
    [fromBase, canConvert],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    localStorage.setItem(THEME_KEY, next);
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12" style={{ backgroundColor: 'rgb(var(--color-bg))' }}>
      <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
        <Header
          onToggleTheme={toggleTheme}
          onOpenHelp={() => setIsHelpOpen(true)}
          themeLabel={theme === 'light' ? 'Dark mode' : 'Light mode'}
        />

        {isOffline && (
          <div
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium"
            style={{ backgroundColor: 'rgb(var(--color-surface-alt))', color: 'rgb(var(--color-text-secondary))' }}
            role="status"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
              <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
              <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
              <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <line x1="12" y1="20" x2="12.01" y2="20" />
            </svg>
            Offline — conversions run locally
          </div>
        )}

        <main className="flex flex-col gap-4">
          <ConverterCard
            value={value}
            fromBase={fromBase}
            toBase={toBase}
            error={error}
            onChangeValue={handleValueChange}
            onChangeFromBase={setFromBase}
            onChangeToBase={setToBase}
            onConvert={handleConvert}
            onSwap={handleSwap}
            onClear={handleClear}
            canConvert={canConvert}
            inputRef={inputRef}
          />

          <ResultCard
            result={result}
            onCopy={handleCopy}
            onShare={handleShare}
          />

          <Suspense fallback={null}>
            <StepsPanel steps={steps} onCopy={handleStepsCopy} />
          </Suspense>

          <HistoryPanel
            items={history}
            onUse={handleHistoryUse}
            onDelete={handleHistoryDelete}
            onExport={handleHistoryExport}
          />
        </main>
      </div>

      <Toast message={toast} isExiting={toastExiting} />
      <ShortcutsModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};

export default App;
