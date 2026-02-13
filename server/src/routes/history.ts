import { Router } from 'express';
import { isAllowedBase } from '@binary/conversion';
import { addHistory, getHistory } from '../db.js';
import type { HistoryItem, ConvertRequest } from '../types.js';
import { httpError } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', (req, res, next) => {
  try {
    const sessionId = String(req.query.sessionId || '');
    if (!sessionId) {
      throw httpError(400, 'InvalidInput', 'sessionId is required');
    }

    const limit = Math.min(Number(req.query.limit || 10), 50);
    const rows = getHistory(sessionId, limit);
    const response: HistoryItem[] = rows.map((row) => ({
      sessionId: row.sessionId,
      result: row.result,
      steps: row.steps,
      meta: {
        input: row.input,
        fromBase: row.fromBase,
        toBase: row.toBase,
        timestamp: row.createdAt,
      },
    }));

    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.post('/', (req, res, next) => {
  try {
    const body = req.body as ConvertRequest & { sessionId: string; result: string; steps: string[] };
    if (!body.sessionId) {
      throw httpError(400, 'InvalidInput', 'sessionId is required');
    }

    if (!isAllowedBase(body.fromBase) || !isAllowedBase(body.toBase)) {
      throw httpError(400, 'InvalidBase', 'Base must be one of 2, 8, 10, 16.');
    }

    addHistory({
      sessionId: body.sessionId,
      input: body.value,
      fromBase: body.fromBase,
      toBase: body.toBase,
      result: body.result,
      steps: body.steps,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ status: 'stored' });
  } catch (error) {
    next(error);
  }
});

export default router;
