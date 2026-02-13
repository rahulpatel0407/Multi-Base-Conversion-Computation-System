export const apiFetch = async <T>(input: RequestInfo, init?: RequestInit): Promise<T> => {
  const response = await fetch(input, init);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Request failed');
  }
  return response.json() as Promise<T>;
};
