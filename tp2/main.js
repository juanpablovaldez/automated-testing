function validaCUIT(cuit) {
  console.log(`[LOG] Iniciando validación para el CUIT: ${cuit}`);

  if (cuit === undefined || cuit === null) {
    console.warn("[WARN] El CUIT es nulo o indefinido");
    return false;
  }

  // Accept only strings or numbers
  if (typeof cuit !== "string") {
    cuit = cuit.toString();
  }

  // Remove dashes and spaces
  cuit = cuit.replace(/[- ]/g, "");

  if (cuit.length !== 11) {
    console.warn(`[WARN] Longitud incorrecta: ${cuit.length}. Debe ser 11.`);
    return false;
  }

  // Must be all digits
  if (!/^\d+$/.test(cuit)) {
    console.warn("[WARN] El CUIT contiene caracteres no numéricos");
    return false;
  }

  const base = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

  let sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cuit[i], 10) * base[i];
  }

  let expectedZ = 11 - (sum % 11);
  if (expectedZ === 11) expectedZ = 0;
  if (expectedZ === 10) expectedZ = 9; // Common fallback for some CUITs

  const actualZ = parseInt(cuit[10], 10);

  const isValid = expectedZ === actualZ;
  if (isValid) {
    console.info(`[INFO] CUIT ${cuit} es válido`);
  } else {
    console.warn(
      `[WARN] CUIT ${cuit} es inválido. El dígito verificador no coincide.`,
    );
  }

  return isValid;
}

module.exports = { validaCUIT };
