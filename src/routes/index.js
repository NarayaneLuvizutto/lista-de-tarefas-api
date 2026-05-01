const express = require('express');
const { API_PREFIX } = require('../config/constants');
const docsRoutes = require('./docsRoutes');
const usuariosRoutes = require('./usuariosRoutes');
const authRoutes = require('./authRoutes');
const tarefasRoutes = require('./tarefasRoutes');

const router = express.Router();

router.use(docsRoutes);
router.use(API_PREFIX, usuariosRoutes);
router.use(API_PREFIX, authRoutes);
router.use(API_PREFIX, tarefasRoutes);

module.exports = router;
