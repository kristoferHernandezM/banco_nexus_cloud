const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generarCuenta = require("../utils/generarCuenta");
const registrarAuditoria = require("../utils/registrarAuditoria");

const registrar = async (req, res) => {
  try {

    const { nombre, email, password } = req.body;

    const existe = await Usuario.findOne({ email });

    if (existe) {
      return res.status(400).json({
        mensaje: "El correo ya está registrado"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = new Usuario({
      nombre,
      email,
      password: passwordHash
    });

    await usuario.save();

    const totalUsuarios = await Usuario.countDocuments();
    const numeroCuenta = generarCuenta(totalUsuarios + 1);

    usuario.numeroCuenta = numeroCuenta;

    await usuario.save();

    await registrarAuditoria({
        usuario: usuario._id,
        accion: "REGISTRO",
        estado: "exitoso",
        detalle: {
            email: usuario.email,
            cuenta: usuario.numeroCuenta
        }
        });

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      numeroCuenta
    });

  } catch (error) {

    res.status(500).json({
      mensaje: error.message
    });

  }
};

const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
        
        await registrarAuditoria({
            accion: "LOGIN",
            estado: "fallido",
            detalle: {
                email
            }
        });

        return res.status(400).json({
        mensaje: "Usuario no encontrado"
        });
    }

    const passwordValida = await bcrypt.compare(
      password,
      usuario.password
    );

    if (!passwordValida) {
        await registrarAuditoria({
            usuario: usuario._id,
            accion: "LOGIN",
            estado: "fallido",
            detalle: {
                motivo: "Contraseña incorrecta"
            }
        });
        return res.status(400).json({
            mensaje: "Contraseña incorrecta"
        });
    }

    const token = jwt.sign(
      {
        id: usuario._id,
        email: usuario.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h"
      }
    );

    await registrarAuditoria({
    usuario: usuario._id,
    accion: "LOGIN",
    estado: "exitoso",
    detalle: {
        email: usuario.email
    }
    });

    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        nombre: usuario.nombre,
        email: usuario.email,
        numeroCuenta: usuario.numeroCuenta,
        saldo: usuario.saldo
      }
    });

  } catch (error) {

    res.status(500).json({
      mensaje: error.message
    });

  }
};

const perfil = async (req, res) => {

  try {

    const usuario = await Usuario.findById(
      req.usuario.id
    ).select("-password");

    await registrarAuditoria({
        usuario: usuario._id,
        accion: "CONSULTA_PERFIL",
        estado: "exitoso"
        });
    res.json(usuario);

  } catch (error) {

    res.status(500).json({
      mensaje: error.message
    });

  }

};

const cambiarPassword = async (req, res) => {
  try {

    const {
      passwordActual,
      passwordNueva
    } = req.body;

    const usuario = await Usuario.findById(
      req.usuario.id
    );

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }

    const coincide = await bcrypt.compare(
      passwordActual,
      usuario.password
    );

    if (!coincide) {

      await registrarAuditoria({
        usuario: usuario._id,
        accion: "CAMBIO_PASSWORD",
        estado: "fallido",
        detalle: {
          motivo: "Contraseña actual incorrecta"
        }
      });

      return res.status(400).json({
        mensaje: "La contraseña actual es incorrecta"
      });
    }

    usuario.password = await bcrypt.hash(
      passwordNueva,
      10
    );

    await usuario.save();

    await registrarAuditoria({
      usuario: usuario._id,
      accion: "CAMBIO_PASSWORD",
      estado: "exitoso"
    });

    res.json({
      mensaje: "Contraseña actualizada correctamente"
    });

  } catch (error) {

    await registrarAuditoria({
      usuario: req.usuario?.id || null,
      accion: "CAMBIO_PASSWORD",
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

const actualizarPerfil = async (req, res) => {
  try {

    const { nombre, email } = req.body;

    const usuario = await Usuario.findById(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }

    if (email && email !== usuario.email) {

      const existe = await Usuario.findOne({
        email
      });

      if (existe) {
        return res.status(400).json({
          mensaje: "Ese correo ya está registrado"
        });
      }
    }

    usuario.nombre = nombre || usuario.nombre;
    usuario.email = email || usuario.email;

    await usuario.save();

    await registrarAuditoria({
      usuario: usuario._id,
      accion: "ACTUALIZAR_PERFIL",
      estado: "exitoso",
      detalle: {
        nombre: usuario.nombre,
        email: usuario.email
      }
    });

    res.json({
      mensaje: "Perfil actualizado correctamente",
      usuario
    });

  } catch (error) {

    await registrarAuditoria({
      usuario: req.usuario?.id || null,
      accion: "ACTUALIZAR_PERFIL",
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
  registrar,
  login,
  perfil,
  cambiarPassword,
  actualizarPerfil
};