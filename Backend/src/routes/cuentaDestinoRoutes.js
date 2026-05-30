const express = require("express");

const router = express.Router();

const verificarToken = require("../middleware/authMiddleware");

const {
  agregarCuentaDestino,
  obtenerCuentasDestino,
  eliminarCuentaDestino
} = require("../controllers/cuentaDestinoController");

router.post("/", verificarToken, agregarCuentaDestino);
router.get("/", verificarToken, obtenerCuentasDestino);
router.delete("/:id", verificarToken, eliminarCuentaDestino);

module.exports = router;