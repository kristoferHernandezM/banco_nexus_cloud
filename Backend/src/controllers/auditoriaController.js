const Auditoria = require("../models/Auditoria");

const obtenerAuditorias = async (req, res) => {
  try {
    const auditorias = await Auditoria.find({
      usuario: req.usuario.id
    })
      .sort({ fecha: -1 })
      .limit(100);

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