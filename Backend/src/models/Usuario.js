const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  numeroCuenta: { type: String, unique: true },
  saldo: { type: Number, default: 10000 },
  fechaRegistro: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Usuario", usuarioSchema);