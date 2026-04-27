require('dotenv').config();
const express = require('express');
const cors = require('cors');

const routes = require('./src/routes');
const pool = require('./src/config/database');

const app = express();

// Configura o CORS para aceitar requisições do frontend
app.use(cors());

// Usa express.json() para parsear o body em formato JSON
app.use(express.json());

// Importa e usa todas as rotas definidas em /routes/index.js
app.use(routes);

// Rota de Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Inicia o servidor na porta do .env (default 3001)
const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  
  // Chama a função para testar a conexão com o banco ao iniciar
  await pool.testConnection();
});
