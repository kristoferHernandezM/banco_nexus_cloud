const Usuario = require("../models/Usuario");
const Transferencia = require("../models/Transferencia");

const obtenerDashboard = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select("-password");

    const transferencias = await Transferencia.find({
      $or: [
        { cuentaOrigen: usuario.numeroCuenta },
        { cuentaDestino: usuario.numeroCuenta }
      ]
    }).sort({ fecha: -1 });

    const transferenciasExitosas = transferencias.filter(
      t => t.estado === "exitosa"
    );

    const totalIngresos = transferenciasExitosas
      .filter(t => t.cuentaDestino === usuario.numeroCuenta)
      .reduce((total, t) => total + t.monto, 0);

    const totalGastos = transferenciasExitosas
      .filter(t => t.cuentaOrigen === usuario.numeroCuenta)
      .reduce((total, t) => total + t.monto, 0);

    const movimientosRecientes = transferencias.slice(0, 5);

    res.json({
      nombre: usuario.nombre,
      email: usuario.email,
      numeroCuenta: usuario.numeroCuenta,
      saldo: usuario.saldo,
      totalTransferencias: transferencias.length,
      transferenciasExitosas: transferenciasExitosas.length,
      totalIngresos,
      totalGastos,
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