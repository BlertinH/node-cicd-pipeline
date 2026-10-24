const { test } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');

test('GET / returns the hello message', async () => {
  const res = await request(app).get('/');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.message, 'Hello from my CI/CD pipeline!');
});

test('GET /health returns ok', async () => {
  const res = await request(app).get('/health');
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(res.body, { status: 'ok' });
});

test('unknown route returns 404', async () => {
  const res = await request(app).get('/does-not-exist');
  assert.strictEqual(res.status, 404);
});