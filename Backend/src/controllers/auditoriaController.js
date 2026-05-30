const Auditoria = require("../models/Auditoria");

const obtenerAuditorias = async (req, res) => {
  try {
    const auditorias = await Auditoria.find({
      usuario: req.usuario.id
    })
      .populate("usuario", "nombre email numeroCuenta")
      .sort({ fecha: -1 });

    res.json(auditorias);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};

module.exports = {
  obtenerAuditorias
};