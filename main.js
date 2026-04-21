/**
 * Calcula el factorial de un número entero no negativo dado.
 * @param {number} n
 * @returns {number} El factorial de n
 */
function factorial(n) {
  if (typeof n !== "number" || !Number.isInteger(n) || n < 0) {
    throw new Error(
      "El parámetro ingresado debe ser un número entero no negativo",
    );
  }
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

module.exports = { factorial };
