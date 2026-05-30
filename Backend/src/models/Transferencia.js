const mongoose = require("mongoose");

const transferenciaSchema = new mongoose.Schema({
  usuarioOrigen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  cuentaOrigen: {
    type: String,
    required: true
  },
  cuentaDestino: {
    type: String,
    required: true
  },
  monto: {
    type: Number,
    required: true
  },
  mensaje: {
    type: String,
    default: ""
  },
  estado: {
    type: String,
    enum: ["exitosa", "fallida", "pendiente"],
    default: "pendiente"
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Transferencia", transferenciaSchema);