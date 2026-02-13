interface ToastProps {
  message: string;
  isExiting: boolean;
}

const Toast = ({ message, isExiting }: ToastProps) => {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-lg ${isExiting ? 'toast-exit' : 'toast-enter'}`}
      style={{ backgroundColor: 'rgb(var(--color-accent))' }}
    >
      {message}
    </div>
  );
};

export default Toast;
