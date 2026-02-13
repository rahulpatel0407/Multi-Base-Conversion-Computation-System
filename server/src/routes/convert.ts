import { Router } from 'express';
import { convert, isAllowedBase, normalizeInput, validateInput } from '@binary/conversion';
import type { ConvertRequest, ConvertResponse } from '../types.js';
import { httpError } from '../middleware/errorHandler.js';

const router = Router();

router.post('/', (req, res, next) => {
  try {
    const body = req.body as ConvertRequest;
    const normalized = normalizeInput(body.value || '');

    if (!isAllowedBase(body.fromBase) || !isAllowedBase(body.toBase)) {
      throw httpError(400, 'InvalidBase', 'Base must be one of 2, 8, 10, 16.');
    }

    const validation = validateInput(normalized, body.fromBase);
    if (!validation.isValid) {
      throw httpError(400, 'InvalidInput', validation.message || 'Invalid input');
    }

    const result = convert(normalized, body.fromBase, body.toBase);

    const response: ConvertResponse = {
      result: result.result,
      steps: result.steps,
      meta: {
        input: normalized,
        fromBase: body.fromBase,
        toBase: body.toBase,
        timestamp: new Date().toISOString(),
      },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
