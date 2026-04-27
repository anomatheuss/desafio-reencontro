const pool = require('../config/database');

const PessoaDesaparecidaModel = {
  // Insere uma nova pessoa desaparecida
  async criar(dados) {
    const { 
      nome, 
      idade, 
      descricao, 
      foto_url, 
      local_desaparecimento, 
      data_desaparecimento, 
      nome_contato, 
      telefone_contato 
    } = dados;

    try {
      const query = `
        INSERT INTO pessoas_desaparecidas 
        (nome, idade, descricao, foto_url, local_desaparecimento, data_desaparecimento, nome_contato, telefone_contato) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *
      `;
      const values = [nome, idade, descricao, foto_url, local_desaparecimento, data_desaparecimento, nome_contato, telefone_contato];
      
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao criar pessoa desaparecida: ${error.message}`);
    }
  },

  // Lista todas as pessoas com status 'desaparecido' (com filtros opcionais)
  async listarTodos(filtros = {}) {
    const { nome, local } = filtros;
    
    let query = `SELECT * FROM pessoas_desaparecidas WHERE status = 'desaparecido'`;
    const values = [];
    let count = 1;

    if (nome) {
      query += ` AND nome ILIKE $${count}`;
      values.push(`%${nome}%`);
      count++;
    }

    if (local) {
      query += ` AND local_desaparecimento ILIKE $${count}`;
      values.push(`%${local}%`);
      count++;
    }

    query += ` ORDER BY created_at DESC`;

    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao listar pessoas: ${error.message}`);
    }
  },

  // Retorna uma pessoa pelo id junto com seus avistamentos
  async buscarPorId(id) {
    try {
      const pessoaResult = await pool.query(
        `SELECT * FROM pessoas_desaparecidas WHERE id = $1`,
        [id]
      );

      if (pessoaResult.rows.length === 0) {
        return null;
      }

      const pessoa = pessoaResult.rows[0];

      // Busca os avistamentos relacionados
      const avistamentosResult = await pool.query(
        `SELECT * FROM avistamentos WHERE pessoa_id = $1 ORDER BY data_avistamento DESC, created_at DESC`,
        [id]
      );

      pessoa.avistamentos = avistamentosResult.rows;

      return pessoa;
    } catch (error) {
      throw new Error(`Erro ao buscar pessoa por ID: ${error.message}`);
    }
  },

  // Atualiza o status
  async atualizarStatus(id, status) {
    try {
      const result = await pool.query(
        `UPDATE pessoas_desaparecidas SET status = $1 WHERE id = $2 RETURNING *`,
        [status, id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao atualizar status: ${error.message}`);
    }
  },

  // Remove o registro
  async deletar(id) {
    try {
      const result = await pool.query(
        `DELETE FROM pessoas_desaparecidas WHERE id = $1 RETURNING *`,
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao deletar pessoa: ${error.message}`);
    }
  }
};

module.exports = PessoaDesaparecidaModel;
