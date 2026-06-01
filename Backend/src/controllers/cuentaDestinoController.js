const CuentaDestino = require("../models/CuentaDestino");
const Usuario = require("../models/Usuario");
const registrarAuditoria = require("../utils/registrarAuditoria");

const agregarCuentaDestino = async (req, res) => {
  try {
    const { alias, numeroCuenta, banco } = req.body;

    if (!/^\d{10}$/.test(numeroCuenta)) {
      await registrarAuditoria({
        usuario: req.usuario.id,
        accion: "ALTA_CUENTA_DESTINO",
        estado: "fallido",
        detalle: {
          motivo: "Formato inválido",
          numeroCuenta
        }
      });

      return res.status(400).json({
        mensaje: "El número de cuenta debe tener 10 dígitos"
      });
    }

    const usuarioActual = await Usuario.findById(req.usuario.id);

    if (usuarioActual.numeroCuenta === numeroCuenta) {
      await registrarAuditoria({
        usuario: req.usuario.id,
        accion: "ALTA_CUENTA_DESTINO",
        estado: "fallido",
        detalle: {
          motivo: "Intento de agregar cuenta propia",
          numeroCuenta
        }
      });

      return res.status(400).json({
        mensaje: "No puedes agregar tu propia cuenta como destino"
      });
    }

    const cuentaExiste = await Usuario.findOne({
      numeroCuenta
    });

    if (!cuentaExiste) {
      await registrarAuditoria({
        usuario: req.usuario.id,
        accion: "ALTA_CUENTA_DESTINO",
        estado: "fallido",
        detalle: {
          motivo: "Cuenta destino inexistente",
          numeroCuenta
        }
      });

      return res.status(404).json({
        mensaje: "La cuenta destino no existe"
      });
    }

    const cuentaDuplicada = await CuentaDestino.findOne({
      usuario: req.usuario.id,
      numeroCuenta
    });

    if (cuentaDuplicada) {
      await registrarAuditoria({
        usuario: req.usuario.id,
        accion: "ALTA_CUENTA_DESTINO",
        estado: "fallido",
        detalle: {
          motivo: "Cuenta destino duplicada",
          numeroCuenta
        }
      });

      return res.status(400).json({
        mensaje: "Esta cuenta destino ya está registrada"
      });
    }

    const cuenta = await CuentaDestino.create({
      usuario: req.usuario.id,
      alias,
      numeroCuenta,
      banco
    });

    await registrarAuditoria({
      usuario: req.usuario.id,
      accion: "ALTA_CUENTA_DESTINO",
      estado: "exitoso",
      detalle: {
        alias,
        numeroCuenta,
        banco
      }
    });

    res.status(201).json({
      mensaje: "Cuenta destino agregada",
      cuenta
    });

  } catch (error) {
    await registrarAuditoria({
      usuario: req.usuario?.id || null,
      accion: "ALTA_CUENTA_DESTINO",
      estado: "fallido",
      detalle: {
        motivo: error.message
      }
    });

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
    const cuenta = await CuentaDestino.findOneAndDelete({
      _id: req.params.id,
      usuario: req.usuario.id
    });

    await registrarAuditoria({
      usuario: req.usuario.id,
      accion: "ELIMINAR_CUENTA_DESTINO",
      estado: cuenta ? "exitoso" : "fallido",
      detalle: {
        cuentaDestinoId: req.params.id,
        numeroCuenta: cuenta?.numeroCuenta || null
      }
    });

    res.json({
      mensaje: "Cuenta eliminada"
    });
  } catch (error) {
    await registrarAuditoria({
      usuario: req.usuario?.id || null,
      accion: "ELIMINAR_CUENTA_DESTINO",
      estado: "fallido",
      detalle: {
        motivo: error.message
      }
    });

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