const AvistamentoModel = require('../models/avistamento');
const PessoaDesaparecidaModel = require('../models/pessoaDesaparecida');

const avistamentoController = {
  // Cria um novo avistamento
  async criar(req, res) {
    try {
      const { pessoa_id, local_avistamento } = req.body;

      // Validação de campos obrigatórios
      if (!pessoa_id || !local_avistamento) {
        return res.status(400).json({ 
          error: 'Os campos pessoa_id e local_avistamento são obrigatórios.' 
        });
      }

      // Opcional: Verificação de segurança para confirmar se a pessoa existe
      const pessoa = await PessoaDesaparecidaModel.buscarPorId(pessoa_id);
      if (!pessoa) {
        return res.status(404).json({ 
          error: 'Pessoa não encontrada para vincular este avistamento.' 
        });
      }

      const novoAvistamento = await AvistamentoModel.criar(req.body);
      return res.status(201).json(novoAvistamento);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

module.exports = avistamentoController;
