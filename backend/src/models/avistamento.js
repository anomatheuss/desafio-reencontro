const pool = require('../config/database');

const AvistamentoModel = {
  // Insere um novo avistamento vinculado a uma pessoa_id
  async criar(dados) {
    const { 
      pessoa_id, 
      local_avistamento, 
      data_avistamento, 
      descricao_avistamento, 
      nome_informante, 
      telefone_informante 
    } = dados;

    try {
      const query = `
        INSERT INTO avistamentos 
        (pessoa_id, local_avistamento, data_avistamento, descricao_avistamento, nome_informante, telefone_informante) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *
      `;
      const values = [
        pessoa_id, 
        local_avistamento, 
        data_avistamento, 
        descricao_avistamento, 
        nome_informante, 
        telefone_informante
      ];
      
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao criar avistamento: ${error.message}`);
    }
  },

  // Lista todos os avistamentos de uma pessoa ordenados por data_avistamento DESC
  async listarPorPessoa(pessoa_id) {
    try {
      const query = `
        SELECT * FROM avistamentos 
        WHERE pessoa_id = $1 
        ORDER BY data_avistamento DESC, created_at DESC
      `;
      const result = await pool.query(query, [pessoa_id]);
      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao listar avistamentos da pessoa: ${error.message}`);
    }
  }
};

module.exports = AvistamentoModel;
