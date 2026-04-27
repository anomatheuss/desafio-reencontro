const express = require('express');
const router = express.Router();
const pessoaDesaparecidaController = require('../controllers/pessoaDesaparecidaController');

// POST /api/pessoas -> criar
router.post('/', pessoaDesaparecidaController.criar);

// GET /api/pessoas -> listar (com query params)
router.get('/', pessoaDesaparecidaController.listar);

// GET /api/pessoas/:id -> buscarPorId
router.get('/:id', pessoaDesaparecidaController.buscarPorId);

// PATCH /api/pessoas/:id/encontrado -> marcarEncontrado
router.patch('/:id/encontrado', pessoaDesaparecidaController.marcarEncontrado);

// DELETE /api/pessoas/:id -> deletar
router.delete('/:id', pessoaDesaparecidaController.deletar);

module.exports = router;
