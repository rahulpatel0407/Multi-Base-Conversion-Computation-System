export interface ConvertRequest {
  value: string;
  fromBase: 2 | 8 | 10 | 16;
  toBase: 2 | 8 | 10 | 16;
}

export interface ConvertResponse {
  result: string;
  steps: string[];
  meta: {
    input: string;
    fromBase: 2 | 8 | 10 | 16;
    toBase: 2 | 8 | 10 | 16;
    timestamp: string;
  };
}

export interface HistoryItem extends ConvertResponse {
  sessionId: string;
}
