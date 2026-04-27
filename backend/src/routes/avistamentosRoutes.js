const express = require('express');
const router = express.Router();
const avistamentoController = require('../controllers/avistamentoController');

// POST /api/avistamentos -> criar
router.post('/', avistamentoController.criar);

module.exports = router;
