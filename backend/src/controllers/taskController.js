const { pool } = require('../config/db');

// GET /tasks?status=active|completed
async function getAllTasks(req, res) {
  try {
    const { status } = req.query;
    let sql = 'SELECT * FROM tasks ORDER BY created_at DESC';
    const params = [];

    if (status === 'active') {
      sql = 'SELECT * FROM tasks WHERE completed = FALSE ORDER BY created_at DESC';
    } else if (status === 'completed') {
      sql = 'SELECT * FROM tasks WHERE completed = TRUE ORDER BY created_at DESC';
    }

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar tarefas.' });
  }
}

// POST /tasks
async function createTask(req, res) {
  try {
    const { title } = req.body;
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'O título da tarefa é obrigatório.' });
    }
    const [result] = await pool.query(
      'INSERT INTO tasks (title) VALUES (?)',
      [title.trim()]
    );
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar tarefa.' });
  }
}

// PUT /tasks/:id
async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const [existing] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }

    const newTitle = title !== undefined ? title.trim() : existing[0].title;
    const newCompleted = completed !== undefined ? completed : existing[0].completed;

    await pool.query(
      'UPDATE tasks SET title = ?, completed = ? WHERE id = ?',
      [newTitle, newCompleted, id]
    );

    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar tarefa.' });
  }
}

// DELETE /tasks/:id
async function deleteTask(req, res) {
  try {
    const { id } = req.params;
    const [existing] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }
    await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
    res.json({ message: 'Tarefa deletada com sucesso.', id: Number(id) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar tarefa.' });
  }
}

module.exports = { getAllTasks, createTask, updateTask, deleteTask };
