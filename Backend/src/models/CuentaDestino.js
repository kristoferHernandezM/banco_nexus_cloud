const mongoose = require("mongoose");

const cuentaDestinoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  alias: {
    type: String,
    required: true
  },
  numeroCuenta: {
    type: String,
    required: true
  },
  banco: {
    type: String,
    default: "Banco Nexus Cloud"
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("CuentaDestino", cuentaDestinoSchema);