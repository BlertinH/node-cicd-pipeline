
const { test } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');

test('GET / returns the TaskFlow website', async () => {
    const res = await request(app).get('/');

    assert.strictEqual(res.status, 200);
    assert.match(res.text, /TaskFlow/);
});

test('GET /health returns ok', async () => {
    const res = await request(app).get('/health');

    assert.strictEqual(res.status, 200);
    assert.deepStrictEqual(res.body, { status: 'ok' });
});

test('GET /api/tasks returns the task list', async () => {
    const res = await request(app).get('/api/tasks');

    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body));
});

test('POST /api/tasks creates a new task', async () => {
    const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'Learn CI/CD' });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.title, 'Learn CI/CD');
    assert.strictEqual(res.body.completed, false);
});

test('POST /api/tasks rejects an empty title', async () => {
    const res = await request(app)
        .post('/api/tasks')
        .send({ title: '' });

    assert.strictEqual(res.status, 400);
});

test('GET unknown route returns 404', async () => {
    const res = await request(app).get('/does-not-exist');

    assert.strictEqual(res.status, 404);
});

