/**
 * Testes de integração para os endpoints da API de tarefas.
 * Usa Jest + Supertest — banco de dados real de teste.
 *
 * Configure a variável DB_NAME como "todo_test_db" em um .env de teste
 * ou o script apagará e recriará a tabela antes de cada suite.
 */

process.env.DB_NAME = 'todo_test_db';
require('dotenv').config();

const request = require('supertest');
const app = require('../src/app');
const { pool, initDB } = require('../src/config/db');

beforeAll(async () => {
  await initDB();
  // Limpa a tabela antes de começar
  await pool.query('DELETE FROM tasks');
});

afterAll(async () => {
  await pool.query('DELETE FROM tasks');
  await pool.end();
});

// ─── GET /tasks ──────────────────────────────────────────────────────────────

describe('GET /tasks', () => {
  it('deve retornar lista vazia inicialmente', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('deve filtrar por status=active', async () => {
    await pool.query("INSERT INTO tasks (title, completed) VALUES ('Ativa', FALSE)");
    await pool.query("INSERT INTO tasks (title, completed) VALUES ('Concluída', TRUE)");

    const res = await request(app).get('/tasks?status=active');
    expect(res.statusCode).toBe(200);
    expect(res.body.every((t) => t.completed === 0 || t.completed === false)).toBe(true);

    await pool.query('DELETE FROM tasks');
  });

  it('deve filtrar por status=completed', async () => {
    await pool.query("INSERT INTO tasks (title, completed) VALUES ('Ativa', FALSE)");
    await pool.query("INSERT INTO tasks (title, completed) VALUES ('Concluída', TRUE)");

    const res = await request(app).get('/tasks?status=completed');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body.every((t) => t.completed === 1 || t.completed === true)).toBe(true);

    await pool.query('DELETE FROM tasks');
  });
});

// ─── POST /tasks ─────────────────────────────────────────────────────────────

describe('POST /tasks', () => {
  it('deve criar uma nova tarefa', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Minha primeira tarefa' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Minha primeira tarefa');
    expect(res.body.completed).toBe(0);

    await pool.query('DELETE FROM tasks WHERE id = ?', [res.body.id]);
  });

  it('deve retornar 400 se o título estiver vazio', async () => {
    const res = await request(app).post('/tasks').send({ title: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('deve retornar 400 se o título estiver ausente', async () => {
    const res = await request(app).post('/tasks').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

// ─── PUT /tasks/:id ──────────────────────────────────────────────────────────

describe('PUT /tasks/:id', () => {
  let taskId;

  beforeEach(async () => {
    const [result] = await pool.query(
      "INSERT INTO tasks (title, completed) VALUES ('Tarefa para editar', FALSE)"
    );
    taskId = result.insertId;
  });

  afterEach(async () => {
    await pool.query('DELETE FROM tasks WHERE id = ?', [taskId]);
  });

  it('deve marcar a tarefa como concluída', async () => {
    const res = await request(app)
      .put(`/tasks/${taskId}`)
      .send({ completed: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.completed).toBe(1);
  });

  it('deve atualizar o título da tarefa', async () => {
    const res = await request(app)
      .put(`/tasks/${taskId}`)
      .send({ title: 'Título atualizado' });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Título atualizado');
  });

  it('deve retornar 404 para id inexistente', async () => {
    const res = await request(app)
      .put('/tasks/999999')
      .send({ completed: true });
    expect(res.statusCode).toBe(404);
  });
});

// ─── DELETE /tasks/:id ───────────────────────────────────────────────────────

describe('DELETE /tasks/:id', () => {
  it('deve deletar uma tarefa existente', async () => {
    const [result] = await pool.query(
      "INSERT INTO tasks (title) VALUES ('Tarefa para deletar')"
    );
    const id = result.insertId;

    const res = await request(app).delete(`/tasks/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(id);

    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    expect(rows.length).toBe(0);
  });

  it('deve retornar 404 para id inexistente', async () => {
    const res = await request(app).delete('/tasks/999999');
    expect(res.statusCode).toBe(404);
  });
});
