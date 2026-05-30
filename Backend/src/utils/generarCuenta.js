function generarCuenta(idSecuencial) {
  const base = "180" + idSecuencial.toString().padStart(6, "0");

  const suma = base
    .split("")
    .reduce((acc, num) => acc + Number(num), 0);

  const digitoVerificador = suma % 10;

  return base + digitoVerificador;
}

module.exports = generarCuenta;