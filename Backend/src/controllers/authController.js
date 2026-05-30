const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const generarCuenta = require("../utils/generarCuenta");

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

module.exports = {
  registrar
};