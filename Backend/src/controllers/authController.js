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

    res.json(usuario);

  } catch (error) {

    res.status(500).json({
      mensaje: error.message
    });

  }

};

module.exports = {
  registrar,
  login,
  perfil
};