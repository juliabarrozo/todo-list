require('dotenv').config();
const { initDB } = require('./src/config/db');
const app = require('./src/app');

const PORT = process.env.PORT || 3001;

async function start() {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`🚀  Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌  Erro ao iniciar o servidor:', err.message);
    process.exit(1);
  }
}

start();
