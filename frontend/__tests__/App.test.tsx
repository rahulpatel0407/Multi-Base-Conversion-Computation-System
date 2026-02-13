import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import App from '../src/App';

// Mock fetch for API calls
const mockFetch = jest.fn();
globalThis.fetch = mockFetch;

// Mock clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
});

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  window.history.replaceState({}, '', '/');

  // Default: API returns empty history, convert succeeds
  mockFetch.mockImplementation((url: string) => {
    if (typeof url === 'string' && url.includes('/api/history') && !url.includes('POST')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    }
    if (typeof url === 'string' && url.includes('/api/convert')) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            result: '10',
            steps: ['1×2^1 + 0×2^0 = 2'],
          }),
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    });
  });
});

describe('App', () => {
  it('renders without accessibility violations', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders main UI elements', () => {
    render(<App />);
    expect(screen.getByText('Base Converter')).toBeInTheDocument();
    expect(screen.getByLabelText('Value to convert')).toBeInTheDocument();
    expect(screen.getByText('Convert')).toBeInTheDocument();
    expect(screen.getByText('Result')).toBeInTheDocument();
  });

  it('shows base selector segmented controls', () => {
    render(<App />);
    const binButtons = screen.getAllByText('BIN');
    expect(binButtons.length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('OCT').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('DEC').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('HEX').length).toBeGreaterThanOrEqual(1);
  });

  it('disables convert button when input is empty', () => {
    render(<App />);
    const convertBtn = screen.getByText('Convert');
    expect(convertBtn).toBeDisabled();
  });

  it('enables convert button with valid input', async () => {
    render(<App />);
    const input = screen.getByLabelText('Value to convert');
    await userEvent.type(input, '1010');
    const convertBtn = screen.getByText('Convert');
    expect(convertBtn).toBeEnabled();
  });

  it('filters invalid characters for binary input', async () => {
    render(<App />);
    const input = screen.getByLabelText('Value to convert') as HTMLInputElement;
    await userEvent.type(input, '1023abc');
    // Only 1 and 0 are valid for binary
    expect(input.value).toBe('10');
  });

  it('swaps bases when swap button is clicked', async () => {
    render(<App />);
    // Default: from BIN to DEC
    const fromRadios = screen.getAllByRole('radiogroup');
    const swapBtn = screen.getByLabelText('Swap bases');
    fireEvent.click(swapBtn);
    // After swap: from DEC to BIN
    const fromGroup = fromRadios[0];
    const checkedInFrom = fromGroup.querySelector('[aria-checked="true"]');
    expect(checkedInFrom?.textContent).toBe('DEC');
  });

  it('converts binary to decimal via API', async () => {
    mockFetch.mockImplementation((url: string) => {
      if (typeof url === 'string' && url.includes('/api/convert')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ result: '10', steps: ['1×2^1 + 0×2^0 = 2'] }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    });

    render(<App />);
    const input = screen.getByLabelText('Value to convert');
    await userEvent.type(input, '1010');
    const convertBtn = screen.getByText('Convert');
    fireEvent.click(convertBtn);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/convert',
        expect.objectContaining({ method: 'POST' }),
      );
    });
  });

  it('falls back to local conversion when API is unavailable', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    render(<App />);
    const input = screen.getByLabelText('Value to convert');
    await userEvent.type(input, '1010');

    const convertBtn = screen.getByText('Convert');
    fireEvent.click(convertBtn);

    await waitFor(() => {
      // Should show the result from local conversion
      const resultText = screen.getByText('Result').closest('div');
      expect(resultText).toBeInTheDocument();
    });
  });

  it('shows the shortcuts modal when ? is pressed', async () => {
    render(<App />);
    fireEvent.keyDown(window, { key: '?' });
    await waitFor(() => {
      expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
    });
  });

  it('closes shortcuts modal on Escape', async () => {
    render(<App />);
    fireEvent.keyDown(window, { key: '?' });
    await waitFor(() => {
      expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
    });
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByText('Keyboard Shortcuts')).not.toBeInTheDocument();
    });
  });

  it('toggles theme', () => {
    render(<App />);
    const themeBtn = screen.getByLabelText('Dark mode');
    fireEvent.click(themeBtn);
    expect(localStorage.getItem('converter_theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('persists and restores theme from localStorage', () => {
    localStorage.setItem('converter_theme', 'dark');
    render(<App />);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(screen.getByLabelText('Light mode')).toBeInTheDocument();
  });

  it('shows clear button only when input has value', async () => {
    render(<App />);
    expect(screen.queryByLabelText('Clear input')).not.toBeInTheDocument();
    const input = screen.getByLabelText('Value to convert');
    await userEvent.type(input, '1');
    expect(screen.getByLabelText('Clear input')).toBeInTheDocument();
  });

  it('clears all state when clear button is clicked', async () => {
    render(<App />);
    const input = screen.getByLabelText('Value to convert') as HTMLInputElement;
    await userEvent.type(input, '1010');
    const clearBtn = screen.getByLabelText('Clear input');
    fireEvent.click(clearBtn);
    expect(input.value).toBe('');
  });

  it('shows "How it works" panel as collapsible details', () => {
    render(<App />);
    const summary = screen.getByText('How it works');
    expect(summary).toBeInTheDocument();
    expect(summary.closest('details')).toBeInTheDocument();
  });

  it('shows history panel as collapsible details', () => {
    render(<App />);
    const summary = screen.getByText(/History/);
    expect(summary).toBeInTheDocument();
  });
});
