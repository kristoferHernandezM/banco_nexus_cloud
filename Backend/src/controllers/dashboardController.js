const Usuario = require("../models/Usuario");
const Transferencia = require("../models/Transferencia");

const obtenerDashboard = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select("-password");

    const totalTransferencias = await Transferencia.countDocuments({
      $or: [
        { cuentaOrigen: usuario.numeroCuenta },
        { cuentaDestino: usuario.numeroCuenta }
      ]
    });

    const transferenciasExitosas = await Transferencia.countDocuments({
      $or: [
        { cuentaOrigen: usuario.numeroCuenta },
        { cuentaDestino: usuario.numeroCuenta }
      ],
      estado: "exitosa"
    });

    const movimientosRecientes = await Transferencia.find({
      $or: [
        { cuentaOrigen: usuario.numeroCuenta },
        { cuentaDestino: usuario.numeroCuenta }
      ]
    })
      .sort({ fecha: -1 })
      .limit(5);

    res.json({
      nombre: usuario.nombre,
      email: usuario.email,
      numeroCuenta: usuario.numeroCuenta,
      saldo: usuario.saldo,
      totalTransferencias,
      transferenciasExitosas,
      movimientosRecientes
    });

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};

module.exports = {
  obtenerDashboard
};