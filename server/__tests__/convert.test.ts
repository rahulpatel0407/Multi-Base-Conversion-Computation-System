import request from 'supertest';
import express from 'express';
import convertRouter from '../src/routes/convert';

const app = express();
app.use(express.json());
app.use('/api/convert', convertRouter);

describe('POST /api/convert', () => {
  it('converts binary to decimal', async () => {
    const res = await request(app).post('/api/convert').send({
      value: '1011',
      fromBase: 2,
      toBase: 10,
    });

    expect(res.status).toBe(200);
    expect(res.body.result).toBe('11');
  });

  it('rejects invalid input', async () => {
    const res = await request(app).post('/api/convert').send({
      value: '109',
      fromBase: 2,
      toBase: 10,
    });

    expect(res.status).toBe(400);
  });
});
