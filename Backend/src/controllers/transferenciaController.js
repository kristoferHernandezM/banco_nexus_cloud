const mongoose = require("mongoose");
const Usuario = require("../models/Usuario");
const Transferencia = require("../models/Transferencia");
const registrarAuditoria = require("../utils/registrarAuditoria");

const realizarTransferencia = async (req, res) => {
  const session = await mongoose.startSession();
  

  try {
    session.startTransaction();

    const { cuentaDestino, monto, mensaje } = req.body;

    if (!/^\d{10}$/.test(cuentaDestino)) {
      await session.abortTransaction();
      return res.status(400).json({ mensaje: "La cuenta destino debe tener 10 dígitos" });
    }

    if (monto <= 0) {
      await session.abortTransaction();
      return res.status(400).json({ mensaje: "El monto debe ser mayor a 0" });
    }

    const origen = await Usuario.findById(req.usuario.id).session(session);

    if (!origen) {
      await session.abortTransaction();
      return res.status(404).json({ mensaje: "Usuario origen no encontrado" });
    }

    if (origen.numeroCuenta === cuentaDestino) {
      await session.abortTransaction();
      return res.status(400).json({ mensaje: "No puedes transferirte a tu misma cuenta" });
    }

    const destino = await Usuario.findOne({ numeroCuenta: cuentaDestino }).session(session);

    if (!destino) {
      await session.abortTransaction();
      return res.status(404).json({ mensaje: "Cuenta destino no encontrada" });
    }

    if (origen.saldo < monto) {
      await Transferencia.create([{
        usuarioOrigen: origen._id,
        cuentaOrigen: origen.numeroCuenta,
        cuentaDestino,
        monto,
        mensaje,
        estado: "fallida"
      }], { session });

      await session.commitTransaction();

      await registrarAuditoria({
            usuario: origen._id,
            accion: "TRANSFERENCIA",
            estado: "fallido",
            detalle: {
                motivo: "Fondos insuficientes",
                monto
            }
        });

      return res.status(400).json({ mensaje: "Fondos insuficientes" });
    }

    origen.saldo -= monto;
    destino.saldo += monto;

    await origen.save({ session });
    await destino.save({ session });

    const transferencia = await Transferencia.create([{
      usuarioOrigen: origen._id,
      cuentaOrigen: origen.numeroCuenta,
      cuentaDestino,
      monto,
      mensaje,
      estado: "exitosa"
    }], { session });

    await session.commitTransaction();

    await registrarAuditoria({
        usuario: origen._id,
        accion: "TRANSFERENCIA",
        estado: "exitoso",
        detalle: {
            cuentaOrigen: origen.numeroCuenta,
            cuentaDestino,
            monto
        }
    });

    res.status(201).json({
      mensaje: "Transferencia realizada correctamente",
      transferencia: transferencia[0]
    });

  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ mensaje: error.message });
  } finally {
    session.endSession();
  }
};

const obtenerTransferencias = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);

    const transferencias = await Transferencia.find({
      $or: [
        { cuentaOrigen: usuario.numeroCuenta },
        { cuentaDestino: usuario.numeroCuenta }
      ]
    }).sort({ fecha: -1 });

    res.json(transferencias);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

module.exports = {
  realizarTransferencia,
  obtenerTransferencias
};