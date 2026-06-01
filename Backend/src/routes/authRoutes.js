const express = require("express");

const router = express.Router();
const verificarToken = require("../middleware/authMiddleware");

const {
  registrar,
  login,
  perfil,
  cambiarPassword,
  actualizarPerfil
} = require("../controllers/authController");

router.post("/register", registrar);
router.post("/login", login);

router.get(
  "/perfil",
  verificarToken,
  perfil
);

router.put(
  "/perfil",
  verificarToken,
  actualizarPerfil
);

router.put(
  "/password",
  verificarToken,
  cambiarPassword
);

module.exports = router;