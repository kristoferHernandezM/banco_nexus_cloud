const express = require("express");

const router = express.Router();
const verificarToken = require("../middleware/authMiddleware");

const {
    registrar,
    login,
    perfil
} = require("../controllers/authController");

router.post("/register", registrar);
router.post("/login", login);
router.get(
  "/perfil",
  verificarToken,
  perfil
);

module.exports = router;