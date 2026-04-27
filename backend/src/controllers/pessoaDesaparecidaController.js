const PessoaDesaparecidaModel = require('../models/pessoaDesaparecida');

const pessoaDesaparecidaController = {
  // Criar uma nova pessoa
  async criar(req, res) {
    try {
      const { nome, local_desaparecimento, nome_contato } = req.body;
      
      // Validação de campos obrigatórios
      if (!nome || !local_desaparecimento || !nome_contato) {
        return res.status(400).json({ 
          error: 'Os campos nome, local_desaparecimento e nome_contato são obrigatórios.' 
        });
      }

      const novaPessoa = await PessoaDesaparecidaModel.criar(req.body);
      return res.status(201).json(novaPessoa);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Listar todas (com filtros via query string)
  async listar(req, res) {
    try {
      const { nome, local } = req.query;
      const pessoas = await PessoaDesaparecidaModel.listarTodos({ nome, local });
      return res.status(200).json(pessoas);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Buscar detalhes de uma pessoa específica + seus avistamentos
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const pessoa = await PessoaDesaparecidaModel.buscarPorId(id);
      
      if (!pessoa) {
        return res.status(404).json({ error: 'Pessoa desaparecida não encontrada.' });
      }

      return res.status(200).json(pessoa);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Atualizar o status para "encontrado"
  async marcarEncontrado(req, res) {
    try {
      const { id } = req.params;
      const pessoaAtualizada = await PessoaDesaparecidaModel.atualizarStatus(id, 'encontrado');
      
      if (!pessoaAtualizada) {
        return res.status(404).json({ error: 'Pessoa desaparecida não encontrada.' });
      }

      return res.status(200).json(pessoaAtualizada);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Deletar o registro
  async deletar(req, res) {
    try {
      const { id } = req.params;
      const pessoaDeletada = await PessoaDesaparecidaModel.deletar(id);
      
      if (!pessoaDeletada) {
        return res.status(404).json({ error: 'Pessoa desaparecida não encontrada.' });
      }

      return res.status(200).json({ message: 'Registro deletado com sucesso.', pessoa: pessoaDeletada });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

module.exports = pessoaDesaparecidaController;
