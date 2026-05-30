const express = require("express");

const router = express.Router();

const verificarToken = require("../middleware/authMiddleware");

const {
  obtenerAuditorias
} = require("../controllers/auditoriaController");

router.get("/", verificarToken, obtenerAuditorias);

module.exports = router;