const chai = require("chai");
const assert = chai.assert;
const expect = chai.expect;
chai.should(); // Inicializa should

const { factorial } = require("./main");

describe("Pruebas de la función Factorial", function () {
  // Pruebas usando assert
  it("debería devolver 1 cuando n es 0 (usando assert)", function () {
    assert.strictEqual(factorial(0), 1, "factorial(0) debería ser 1");
  });

  it("debería lanzar un error cuando n es negativo (usando assert)", function () {
    assert.throws(
      () => factorial(-5),
      Error,
      "El parámetro ingresado debe ser un número entero no negativo",
    );
  });

  // Pruebas usando expect
  it("debería devolver 120 cuando n es 5 (usando expect)", function () {
    expect(factorial(5)).to.equal(120);
  });

  it("debería lanzar un error para ingresos no enteros (usando expect)", function () {
    expect(() => factorial(3.5)).to.throw(
      Error,
      "El parámetro ingresado debe ser un número entero no negativo",
    );
  });

  // Pruebas usando should
  it("debería devolver 3628800 cuando n es 10 (usando should)", function () {
    factorial(10).should.equal(3628800);
  });

  it("debería lanzar un error cuando el ingreso es una cadena (usando should)", function () {
    (() => factorial("5")).should.throw(
      Error,
      "El parámetro ingresado debe ser un número entero no negativo",
    );
  });
});
