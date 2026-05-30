const Auditoria = require("../models/Auditoria");

const registrarAuditoria = async ({
  usuario = null,
  accion,
  estado,
  detalle = {}
}) => {
  try {
    await Auditoria.create({
      usuario,
      accion,
      estado,
      detalle
    });
  } catch (error) {
    console.error("Error registrando auditoría:", error.message);
  }
};

module.exports = registrarAuditoria;