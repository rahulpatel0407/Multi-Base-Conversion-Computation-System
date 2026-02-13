import request from 'supertest';
import express from 'express';
import historyRouter from '../src/routes/history';

const app = express();
app.use(express.json());
app.use('/api/history', historyRouter);

describe('POST /api/history', () => {
  it('requires sessionId', async () => {
    const res = await request(app).post('/api/history').send({
      value: '10',
      fromBase: 2,
      toBase: 10,
      result: '2',
      steps: ['1×2^1 + 0×2^0 = 2'],
    });
    expect(res.status).toBe(400);
  });
});
