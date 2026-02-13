import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const dataFile = path.join(dataDir, 'history.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export interface HistoryRecord {
  sessionId: string;
  input: string;
  fromBase: 2 | 8 | 10 | 16;
  toBase: 2 | 8 | 10 | 16;
  result: string;
  steps: string[];
  createdAt: string;
}

const readStore = (): HistoryRecord[] => {
  if (!fs.existsSync(dataFile)) {
    return [];
  }
  const raw = fs.readFileSync(dataFile, 'utf-8');
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as HistoryRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeStore = (records: HistoryRecord[]) => {
  fs.writeFileSync(dataFile, JSON.stringify(records, null, 2));
};

export const addHistory = (record: HistoryRecord) => {
  const records = readStore();
  records.unshift(record);
  writeStore(records.slice(0, 100));
};

export const getHistory = (sessionId: string, limit: number) => {
  const records = readStore();
  return records.filter((item) => item.sessionId === sessionId).slice(0, limit);
};
