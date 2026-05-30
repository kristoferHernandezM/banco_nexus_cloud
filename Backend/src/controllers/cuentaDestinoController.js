const CuentaDestino = require("../models/CuentaDestino");
const Usuario = require("../models/Usuario");

const agregarCuentaDestino = async (req, res) => {
  try {
    const { alias, numeroCuenta, banco } = req.body;

    if (!/^\d{10}$/.test(numeroCuenta)) {
      return res.status(400).json({
        mensaje: "El número de cuenta debe tener 10 dígitos"
      });
    }

    const cuentaExiste = await Usuario.findOne({
      numeroCuenta
    });

    if (!cuentaExiste) {
      return res.status(404).json({
        mensaje: "La cuenta destino no existe"
      });
    }

    const cuenta = await CuentaDestino.create({
      usuario: req.usuario.id,
      alias,
      numeroCuenta,
      banco
    });

    res.status(201).json({
      mensaje: "Cuenta destino agregada",
      cuenta
    });

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};

const obtenerCuentasDestino = async (req, res) => {
  try {
    const cuentas = await CuentaDestino.find({
      usuario: req.usuario.id
    }).sort({ fechaRegistro: -1 });

    res.json(cuentas);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};

const eliminarCuentaDestino = async (req, res) => {
  try {
    await CuentaDestino.findOneAndDelete({
      _id: req.params.id,
      usuario: req.usuario.id
    });

    res.json({
      mensaje: "Cuenta eliminada"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};

module.exports = {
  agregarCuentaDestino,
  obtenerCuentasDestino,
  eliminarCuentaDestino
};