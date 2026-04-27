require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
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
