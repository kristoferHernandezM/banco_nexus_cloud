const express = require("express");

const router = express.Router();

const verificarToken = require("../middleware/authMiddleware");

const {
  realizarTransferencia,
  obtenerTransferencias
} = require("../controllers/transferenciaController");

router.post("/", verificarToken, realizarTransferencia);
router.get("/", verificarToken, obtenerTransferencias);

module.exports = router;