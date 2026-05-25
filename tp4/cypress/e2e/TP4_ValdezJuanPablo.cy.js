/**
 * TP4 - Tests End to End - Cypress
 * Testeo Automatizado - UNSTA
 * Alumno: Valdez Juan Pablo
 * Sitio bajo prueba: https://practicesoftwaretesting.com
 */

const LOGIN_EMAIL = 'juanpaavaldezz@gmail.com';
const LOGIN_PASS = '@EuR3K4!3710';

describe('TP4 ValdezJuanPablo - Practice Software Testing E2E', () => {

  it('TC01 - Login con credenciales válidas redirige al perfil', () => {
    cy.visit('/auth/login');
    cy.get('[data-test="email"]').type(LOGIN_EMAIL);
    cy.get('[data-test="password"]').type(LOGIN_PASS);
    cy.get('[data-test="login-submit"]').click();
    cy.url().should('include', '/account');
    cy.get('[data-test="nav-menu"]').should('be.visible');
  });

  it('TC02 - Login con credenciales inválidas muestra mensaje de error', () => {
    cy.visit('/auth/login');
    cy.get('[data-test="email"]').type('no_existe_este_usuario@test.com');
    cy.get('[data-test="password"]').type('ContraseñaMal999!');
    cy.get('[data-test="login-submit"]').click();
    cy.get('[data-test="login-error"]').should('be.visible');
    cy.url().should('include', '/auth/login');
  });

  it('TC03 - Registro de nuevo usuario con datos válidos', () => {
    const uniqueEmail = `testuser${Date.now()}@mail.com`;
    cy.intercept({ method: 'POST', url: /practicesoftwaretesting\.com/ }).as('registerRequest');
    cy.visit('/auth/register');
    cy.get('[data-test="first-name"]').type('Juan');
    cy.get('[data-test="last-name"]').type('Valdez');
    cy.get('[data-test="dob"]')
      .invoke('val', '1990-05-15')
      .trigger('input')
      .trigger('change');
    cy.get('[data-test="street"]').type('Av. Principal 123');
    cy.get('[data-test="city"]').type('Tucuman');
    cy.get('[data-test="state"]').type('Tucuman');
    cy.get('[data-test="country"]').select('Argentina').trigger('change');
    cy.get('[data-test="phone"]').type('3811234567');
    cy.get('[data-test="email"]').type(uniqueEmail);
    cy.get('[data-test="password"]').type('Password123!');
    cy.get('[data-test="register-submit"]').click();
    cy.wait('@registerRequest', { timeout: 15000 }).its('response.statusCode').should('be.lessThan', 300);
  });

  it('TC04 - Agregar producto al carrito incrementa el contador', () => {
    cy.visit('/');
    cy.get('a[href^="/product/"]').first().click();
    cy.url().should('include', '/product/');
    cy.get('[data-test="add-to-cart"]').click();
    cy.get('[data-test="cart-quantity"]', { timeout: 10000 }).should('be.visible');
  });

  it('TC05 - Búsqueda de producto retorna resultados relevantes', () => {
    cy.visit('/');
    cy.get('[data-test="search-query"]').type('Pliers');
    cy.get('[data-test="search-submit"]').click();
    cy.get('.card').should('have.length.greaterThan', 0);
    cy.contains('Pliers').should('be.visible');
  });

  it('TC06 - Formulario de contacto se envía correctamente', () => {
    cy.visit('/contact');
    cy.get('[data-test="first-name"]').type('Juan');
    cy.get('[data-test="last-name"]').type('Valdez');
    cy.get('[data-test="email"]').type('juanpaavaldezz@gmail.com');
    cy.get('[data-test="subject"]').select('Return');
    cy.get('[data-test="message"]').type('Mensaje de prueba automatizado para el TP4 de Testeo Automatizado - UNSTA.');
    cy.get('[data-test="contact-submit"]').click();
    cy.get('.alert-success').should('be.visible');
  });

});
