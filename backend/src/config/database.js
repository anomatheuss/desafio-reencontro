require('dotenv').config();
const { Pool } = require('pg');

// Usa DATABASE_URL se disponível (Render/produção), senão usa variáveis individuais (local)
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // necessário no Render
    })
  : new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
    client.release();
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error.message);
  }
};

pool.testConnection = testConnection;
module.exports = pool;
