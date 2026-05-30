const mongoose = require("mongoose");

const auditoriaSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    default: null
  },
  accion: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    enum: ["exitoso", "fallido", "pendiente"],
    required: true
  },
  detalle: {
    type: Object,
    default: {}
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Auditoria", auditoriaSchema);