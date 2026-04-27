const express = require('express');
const router = express.Router();

const pessoasRoutes = require('./pessoasRoutes');
const avistamentosRoutes = require('./avistamentosRoutes');

// Registra todas as rotas centralizadas neste arquivo
router.use('/api/pessoas', pessoasRoutes);
router.use('/api/avistamentos', avistamentosRoutes);

module.exports = router;
