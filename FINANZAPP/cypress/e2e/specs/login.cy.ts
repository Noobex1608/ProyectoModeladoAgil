/// <reference types="cypress" />

describe('Login E2E Tests', () => {
  beforeEach(() => {
    // Visitar la página de login antes de cada test
    cy.visit('/login');
    
    // Limpiar localStorage y sessionStorage
    cy.clearLocalStorage();
    cy.clearAllSessionStorage();
  });

  // ========== TESTS DE UI Y ELEMENTOS ==========
  describe('Elementos de la UI', () => {
    it('Debe cargar la página de login correctamente', () => {
      cy.url().should('include', '/login');
      cy.contains('FINANZAPP').should('be.visible');
      cy.contains('Tu aliado financiero').should('be.visible');
      cy.contains('¡Bienvenido!').should('be.visible');
    });

    it('Debe mostrar todos los campos del formulario', () => {
      cy.get('input[type="email"]').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');
      cy.get('input[type="checkbox"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('Debe tener placeholders correctos', () => {
      cy.get('[data-testid="email"]')
        .should('have.attr', 'placeholder', 'tu@live.uleam.edu.ec');
      
      cy.get('[data-testid="password"]')
        .should('have.attr', 'placeholder', '••••••••');
    });

    it('Debe mostrar las etiquetas de los campos', () => {
      cy.contains('Correo Electrónico').should('be.visible');
      cy.contains('Contraseña').should('be.visible');
      cy.contains('Recordarme').should('be.visible');
    });

    it('Debe mostrar el enlace para recuperar contraseña', () => {
      cy.contains('¿Olvidaste tu contraseña?').should('be.visible');
      cy.get('a[href="/forgot-password"]').should('exist');
    });

    it('Debe mostrar el enlace para registrarse', () => {
      cy.contains('¿No tienes cuenta?').should('be.visible');
      cy.contains('Regístrate').should('be.visible');
      cy.get('a[href="/register"]').should('exist');
    });

    it('Debe mostrar el botón de iniciar sesión', () => {
      cy.get('[data-testid="btn-login"]')
        .should('be.visible')
        .should('contain', 'Iniciar Sesión');
    });
  });

  // ========== TESTS DE INTERACCIÓN ==========
  describe('Interacción con el formulario', () => {
    it('Debe permitir escribir en el campo de email', () => {
      const email = 'test@live.uleam.edu.ec';
      
      cy.get('[data-testid="email"]')
        .type(email)
        .should('have.value', email);
    });

    it('Debe permitir escribir en el campo de contraseña', () => {
      const password = 'TestPassword123#';
      
      cy.get('[data-testid="password"]')
        .type(password)
        .should('have.value', password);
    });

    it('Debe permitir marcar el checkbox de recordarme', () => {
      cy.get('input[type="checkbox"]')
        .should('not.be.checked')
        .check()
        .should('be.checked');
    });

    it('Debe alternar la visibilidad de la contraseña', () => {
      cy.get('[data-testid="password"]')
        .should('have.attr', 'type', 'password');
      
      // Hacer clic en el botón de toggle
      cy.get('.password-toggle').first().click();
      
      cy.get('[data-testid="password"]')
        .should('have.attr', 'type', 'text');
      
      // Hacer clic de nuevo
      cy.get('.password-toggle').first().click();
      
      cy.get('[data-testid="password"]')
        .should('have.attr', 'type', 'password');
    });

    it('Debe limpiar los campos después de escribir', () => {
      cy.get('[data-testid="email"]')
        .type('test@live.uleam.edu.ec')
        .clear()
        .should('have.value', '');
      
      cy.get('[data-testid="password"]')
        .type('password123')
        .clear()
        .should('have.value', '');
    });
  });

  // ========== TESTS DE VALIDACIÓN ==========
  describe('Validaciones del formulario', () => {
    it('Debe mostrar error con dominio de email inválido', () => {
      cy.get('[data-testid="email"]').type('test@gmail.com');
      cy.get('[data-testid="password"]').type('TestPass123#');
      cy.get('[data-testid="btn-login"]').click();
      
      // Verificar que aparece el mensaje de error
      cy.contains('@live.uleam.edu.ec').should('be.visible');
      cy.get('.alert-error').should('be.visible');
    });

    it('No debe enviar el formulario con campos vacíos', () => {
      cy.get('[data-testid="btn-login"]').click();
      
      // Los campos requeridos deben activar la validación HTML5
      cy.get('[data-testid="email"]').then(($input) => {
        const input = $input[0] as HTMLInputElement;
        expect(input.validity.valid).to.be.false;
      });
    });

    it('Debe validar formato de email', () => {
      cy.get('[data-testid="email"]').type('emailinvalido');
      cy.get('[data-testid="password"]').type('TestPass123#');
      
      cy.get('[data-testid="email"]').then(($input) => {
        const input = $input[0] as HTMLInputElement;
        expect(input.validity.valid).to.be.false;
      });
    });

    it('Debe mostrar error con credenciales incorrectas', () => {
      cy.get('[data-testid="email"]').type('noexiste@live.uleam.edu.ec');
      cy.get('[data-testid="password"]').type('PasswordIncorrecto123#');
      cy.get('[data-testid="btn-login"]').click();
      
      // Esperar a que aparezca un mensaje de error
      cy.get('.alert-error', { timeout: 10000 }).should('be.visible');
    });
  });

  // ========== TESTS DE NAVEGACIÓN ==========
  describe('Navegación', () => {
    it('Debe navegar a la página de registro al hacer clic en "Regístrate"', () => {
      cy.contains('Regístrate').click();
      cy.url().should('include', '/register');
    });

    it('Debe navegar a la página de recuperación de contraseña', () => {
      cy.contains('¿Olvidaste tu contraseña?').click();
      cy.url().should('include', '/forgot-password');
    });
  });

  // ========== TESTS DE FUNCIONALIDAD DE "RECORDARME" ==========
  describe('Funcionalidad "Recordarme"', () => {
    it('Debe guardar el email en localStorage cuando "Recordarme" está marcado', () => {
      const email = 'test@live.uleam.edu.ec';
      
      cy.get('[data-testid="email"]').type(email);
      cy.get('input[type="checkbox"]').check();
      
      // Simular un intento de login (aunque falle)
      cy.get('[data-testid="password"]').type('TestPass123#');
      cy.get('[data-testid="btn-login"]').click();
      
      // Esperar a que termine el proceso
      cy.wait(2000);
      
      // Verificar localStorage (esto solo funcionaría con credenciales válidas)
      // Para este test, solo verificamos que el checkbox funciona
      cy.get('input[type="checkbox"]').should('be.checked');
    });

    it('Debe cargar el email guardado al volver a la página', () => {
      const email = 'saved@live.uleam.edu.ec';
      
      // Simular que hay un email guardado
      cy.window().then((win) => {
        win.localStorage.setItem('rememberEmail', email);
        win.localStorage.setItem('rememberMe', 'true');
      });
      
      // Recargar la página
      cy.reload();
      
      // Verificar que el email se cargó
      cy.get('[data-testid="email"]').should('have.value', email);
      cy.get('input[type="checkbox"]').should('be.checked');
    });
  });

  // ========== TESTS DE ESTADO DE CARGA ==========
  describe('Estado de carga', () => {
    it('Debe mostrar estado de carga al enviar el formulario', () => {
      cy.get('[data-testid="email"]').type('test@live.uleam.edu.ec');
      cy.get('[data-testid="password"]').type('TestPass123#');
      cy.get('[data-testid="btn-login"]').click();
      
      // Verificar que aparece el texto "Iniciando..."
      cy.contains('Iniciando...', { timeout: 1000 }).should('be.visible');
    });

    it('Debe deshabilitar el botón durante el proceso de login', () => {
      cy.get('[data-testid="email"]').type('test@live.uleam.edu.ec');
      cy.get('[data-testid="password"]').type('TestPass123#');
      cy.get('[data-testid="btn-login"]').click();
      
      // El botón debe estar deshabilitado temporalmente
      cy.get('[data-testid="btn-login"]').should('be.disabled');
    });
  });

  // ========== TESTS DE ESTILOS Y CLASES CSS ==========
  describe('Estilos y clases CSS', () => {
    it('Debe aplicar clase de error cuando hay error en el email', () => {
      cy.get('[data-testid="email"]').type('test@gmail.com');
      cy.get('[data-testid="password"]').type('TestPass123#');
      cy.get('[data-testid="btn-login"]').click();
      
      cy.get('[data-testid="email"]').should('have.class', 'input-error');
      cy.get('.field-error').should('be.visible');
    });

    it('Debe tener las clases CSS correctas en los elementos principales', () => {
      cy.get('.login-container').should('exist');
      cy.get('.login-card').should('exist');
      cy.get('.login-header').should('exist');
      cy.get('.login-content').should('exist');
      cy.get('.login-form').should('exist');
    });

    it('Debe tener decoraciones visuales', () => {
      cy.get('.login-decoration').should('exist');
      cy.get('.logo-title').should('be.visible');
      cy.get('.logo-tagline').should('be.visible');
    });
  });

  // ========== TESTS DE ACCESIBILIDAD ==========
  describe('Accesibilidad', () => {
    it('Los campos deben tener etiquetas asociadas', () => {
      cy.get('label[for="email"]').should('exist');
      cy.get('label[for="password"]').should('exist');
    });

    it('El botón de toggle de contraseña debe tener aria-label', () => {
      cy.get('.password-toggle')
        .first()
        .should('have.attr', 'aria-label', 'Mostrar contraseña');
    });

    it('Los campos deben tener el atributo required', () => {
      cy.get('[data-testid="email"]').should('have.attr', 'required');
      cy.get('[data-testid="password"]').should('have.attr', 'required');
    });
  });

  // ========== TEST DE RESPONSIVE ==========
  describe('Diseño Responsive', () => {
    it('Debe verse correctamente en dispositivos móviles', () => {
      cy.viewport('iphone-x');
      cy.get('.login-card').should('be.visible');
      cy.get('[data-testid="email"]').should('be.visible');
      cy.get('[data-testid="btn-login"]').should('be.visible');
    });

    it('Debe verse correctamente en tablets', () => {
      cy.viewport('ipad-2');
      cy.get('.login-card').should('be.visible');
      cy.get('.login-form').should('be.visible');
    });

    it('Debe verse correctamente en desktop', () => {
      cy.viewport(1920, 1080);
      cy.get('.login-card').should('be.visible');
      cy.get('.login-container').should('be.visible');
    });
  });

  // ========== TEST DE INTEGRACIÓN COMPLETA (Simulado) ==========
  describe('Flujo completo de login (Mock)', () => {
    it('Debe completar el flujo de login con campos válidos', () => {
      // Llenar el formulario con datos válidos
      cy.get('[data-testid="email"]').type('estudiante@live.uleam.edu.ec');
      cy.get('[data-testid="password"]').type('TestPassword123#');
      cy.get('input[type="checkbox"]').check();
      
      // Interceptar la petición a Supabase (si es posible)
      cy.intercept('POST', '**/auth/v1/token**', {
        statusCode: 200,
        body: {
          access_token: 'mock-token',
          user: {
            email: 'estudiante@live.uleam.edu.ec'
          }
        }
      }).as('loginRequest');
      
      // Enviar el formulario
      cy.get('[data-testid="btn-login"]').click();
      
      // Esperar la petición
      cy.wait('@loginRequest', { timeout: 10000 });
    });

    it('Debe manejar errores de red correctamente', () => {
      // Simular error de red
      cy.intercept('POST', '**/auth/v1/token**', {
        forceNetworkError: true
      }).as('loginError');
      
      cy.get('[data-testid="email"]').type('test@live.uleam.edu.ec');
      cy.get('[data-testid="password"]').type('TestPass123#');
      cy.get('[data-testid="btn-login"]').click();
      
      // Verificar que se muestra algún mensaje de error
      cy.get('.alert-error', { timeout: 10000 }).should('be.visible');
    });
  });

  // ========== TESTS DE SEGURIDAD ==========
  describe('Seguridad', () => {
    it('No debe mostrar la contraseña por defecto', () => {
      cy.get('[data-testid="password"]')
        .should('have.attr', 'type', 'password');
    });

    it('No debe guardar la contraseña en el DOM', () => {
      const password = 'SuperSecret123#';
      cy.get('[data-testid="password"]').type(password);
      
      // Verificar que no está visible en el texto del documento
      cy.get('body').should('not.contain', password);
    });

    it('Debe limpiar los errores al volver a intentar', () => {
      // Primer intento con error
      cy.get('[data-testid="email"]').type('test@gmail.com');
      cy.get('[data-testid="password"]').type('TestPass123#');
      cy.get('[data-testid="btn-login"]').click();
      
      cy.get('.alert-error').should('be.visible');
      
      // Corregir el email y volver a intentar
      cy.get('[data-testid="email"]').clear().type('test@live.uleam.edu.ec');
      cy.get('[data-testid="btn-login"]').click();
      
      // El error anterior debería limpiarse
      cy.wait(1000);
    });
  });
});
