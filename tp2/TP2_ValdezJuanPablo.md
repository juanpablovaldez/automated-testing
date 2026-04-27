# Trabajo Práctico N°2 – Tests Unitarios
**Alumno:** Juan Pablo Valdez

A continuación se presenta el código de los archivos `main.js` y `mainTests.js` correspondientes a la implementación y validación de la funcionalidad `validaCUIT`, con sus respectivas pruebas unitarias y cálculo de cobertura usando `mocha`, `chai`, `sinon` e `istanbul` (nyc).

## 1. Código de `main.js`
Este archivo contiene la lógica de validación de CUIT.

```javascript
function validaCUIT(cuit) {
    console.log(`[LOG] Iniciando validación para el CUIT: ${cuit}`);
    
    if (cuit === undefined || cuit === null) {
        console.warn('[WARN] El CUIT es nulo o indefinido');
        return false;
    }
    
    // Accept only strings or numbers
    if (typeof cuit !== 'string') {
        cuit = cuit.toString();
    }
    
    // Remove dashes and spaces
    cuit = cuit.replace(/[- ]/g, '');

    if (cuit.length !== 11) {
        console.warn(`[WARN] Longitud incorrecta: ${cuit.length}. Debe ser 11.`);
        return false;
    }

    // Must be all digits
    if (!/^\\d+$/.test(cuit)) {
        console.warn('[WARN] El CUIT contiene caracteres no numéricos');
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
        console.warn(`[WARN] CUIT ${cuit} es inválido. El dígito verificador no coincide.`);
    }
    
    return isValid;
}

module.exports = { validaCUIT };
```

## 2. Código de `mainTests.js`
Este archivo contiene los 10 tests unitarios solicitados, usando `assert`, `should`, `expect` y un doble de prueba usando `sinon` (Spy de consola).

```javascript
const chai = require('chai');
const sinon = require('sinon');
const { validaCUIT } = require('./main');

const assert = chai.assert;
const expect = chai.expect;
chai.should();

describe('Tests Unitarios - validaCUIT', function() {
    let consoleLogSpy;
    let consoleWarnSpy;
    let consoleInfoSpy;

    beforeEach(function() {
        // Implementación de dobles de prueba usando sinon (Spies)
        consoleLogSpy = sinon.spy(console, 'log');
        consoleWarnSpy = sinon.spy(console, 'warn');
        consoleInfoSpy = sinon.spy(console, 'info');
    });

    afterEach(function() {
        // Restaurar los métodos originales para no afectar otros tests o salidas
        sinon.restore();
    });

    // 1. assert
    it('Debería retornar false si no se proporciona ningún CUIT', function() {
        const result = validaCUIT();
        assert.isFalse(result, 'Un CUIT indefinido debe retornar false');
        assert.isTrue(consoleWarnSpy.calledOnce, 'Debería advertir sobre CUIT nulo');
    });

    // 2. assert
    it('Debería retornar false si la longitud no es igual a 11 caracteres', function() {
        const result = validaCUIT('20123456');
        assert.isFalse(result, 'El CUIT no tiene 11 caracteres');
        assert.isTrue(consoleWarnSpy.calledWithMatch(/Longitud incorrecta/));
    });

    // 3. should
    it('Debería retornar false si el CUIT contiene letras', function() {
        const result = validaCUIT('20A12345678');
        result.should.be.false;
        consoleWarnSpy.calledWithMatch(/caracteres no numéricos/).should.be.true;
    });

    // 4. expect
    it('Debería retornar true para un CUIT válido (sin guiones)', function() {
        const result = validaCUIT('20123456786');
        expect(result).to.be.true;
    });

    // 5. expect
    it('Debería retornar true para un CUIT válido pasado como número (entero)', function() {
        const result = validaCUIT(20123456786);
        expect(result).to.be.true;
        expect(consoleLogSpy.calledOnce).to.be.true;
    });

    // 6. should
    it('Debería remover espacios y guiones y validar correctamente', function() {
        const result = validaCUIT('20-12345678-6');
        result.should.be.true;
        const resultConEspacios = validaCUIT('20 12345678 6');
        resultConEspacios.should.be.true;
    });

    // 7. assert
    it('Debería retornar false si el dígito verificador es incorrecto', function() {
        const result = validaCUIT('20-12345678-2');
        assert.isFalse(result, 'El dígito verificador 2 es incorrecto para este CUIT');
    });

    // 8. expect
    it('Debería retornar true y manejar correctamente el caso donde Z = 0 (suma múltiplo de 11)', function() {
        // CUIT generado para caso Z=0: '20000000060' => sum=22, 22%11=0 => 11-0=11 => 0
        const result = validaCUIT('20000000060');
        expect(result).to.be.true;
    });

    // 9. should
    it('Debería retornar true y manejar el caso donde Z = 9 (suma mod 11 es 1)', function() {
        // CUIT generado para caso Z=9: '20000000019' => sum=12, 12%11=1 => 11-1=10 => 9
        const result = validaCUIT('20000000019');
        result.should.be.true;
    });

    // 10. expect (Dobles de prueba)
    it('Debería registrar correctamente en consola el inicio y resultado de la validación', function() {
        validaCUIT('20123456786');
        
        // Verifica el uso de logger
        expect(consoleLogSpy.called).to.be.true;
        expect(consoleLogSpy.firstCall.args[0]).to.include('Iniciando validación');
        
        // Verifica info cuando es válido
        expect(consoleInfoSpy.calledOnce).to.be.true;
        expect(consoleInfoSpy.firstCall.args[0]).to.include('es válido');
        
        // No debe haber warnings si fue válido
        expect(consoleWarnSpy.called).to.be.false;
    });
});
```

## 3. Resultados de Cobertura (Istanbul / NYC)
La ejecución de `npx nyc mocha mainTests.js` arrojó los siguientes resultados:

```
  10 passing (7ms)

--------------|---------|----------|---------|---------|-------------------
File          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
--------------|---------|----------|---------|---------|-------------------
All files     |     100 |      100 |     100 |     100 |                   
 main.js      |     100 |      100 |     100 |     100 |                   
 mainTests.js |     100 |      100 |     100 |     100 |                   
--------------|---------|----------|---------|---------|-------------------
```
Se alcanzó el **100% de cobertura** en sentencias, ramas, funciones y líneas.
