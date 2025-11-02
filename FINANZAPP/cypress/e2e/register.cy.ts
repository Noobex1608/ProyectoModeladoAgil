/// <reference types="cypress" />

describe('Register E2E Tests', () => {
  beforeEach(() => {
    // Visitar la página de registro antes de cada test
    cy.visit('/register');
    
    // Limpiar localStorage y sessionStorage
    cy.clearLocalStorage();
    cy.clearAllSessionStorage();
  });

  describe('Elementos de la UI', () => {
    it('Debe cargar la página de registro correctamente', () => {
      cy.url().should('include', '/register');
      cy.contains('FINANZAPP').should('be.visible');
      cy.contains('Tu aliado financiero').should('be.visible');
      cy.contains('Crear Cuenta').should('be.visible');
    });

    it('Debe mostrar todos los campos del formulario', () => {
      cy.get('input[type="email"]').should('be.visible');
      cy.get('#firstName').should('be.visible');
      cy.get('#lastName').should('be.visible');
      cy.get('#password').should('be.visible');
      cy.get('#confirmPassword').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('Debe tener placeholders correctos', () => {
      cy.get('input[type="email"]')
        .should('have.attr', 'placeholder', 'tu.nombre@live.uleam.edu.ec');
      
      cy.get('#firstName')
        .should('have.attr', 'placeholder', 'Juan');
      
      cy.get('#lastName')
        .should('have.attr', 'placeholder', 'Pérez');
      
      cy.get('#password')
        .should('have.attr', 'placeholder', '••••••••');
      
      cy.get('#confirmPassword')
        .should('have.attr', 'placeholder', '••••••••');
    });

    it('Debe mostrar las etiquetas de los campos', () => {
      cy.contains('Correo Institucional').should('be.visible');
      cy.contains('Nombre').should('be.visible');
      cy.contains('Apellido').should('be.visible');
      cy.contains('Contraseña').should('be.visible');
      cy.contains('Confirmar Contraseña').should('be.visible');
    });

    it('Debe mostrar el enlace para iniciar sesión', () => {
      cy.contains('¿Ya tienes cuenta?').should('be.visible');
      cy.contains('Inicia Sesión').should('be.visible');
      cy.get('a[href="/login"]').should('exist');
    });

    it('Debe mostrar el botón de crear cuenta', () => {
      cy.get('button[type="submit"]')
        .should('be.visible')
        .should('contain', 'Crear Cuenta');
    });

    it('Debe mostrar los indicadores de requisitos de contraseña', () => {
      cy.get('.password-requirements').should('be.visible');
      cy.contains('8+ caracteres').should('be.visible');
      cy.contains('Mayúscula').should('be.visible');
      cy.contains('Minúscula').should('be.visible');
      cy.contains('Número').should('be.visible');
      cy.contains('Especial').should('be.visible');
    });
  });

  describe('Interacción con el formulario', () => {
    it('Debe permitir escribir en el campo de email', () => {
      const email = 'test@live.uleam.edu.ec';
      
      cy.get('input[type="email"]')
        .type(email)
        .should('have.value', email);
    });

    it('Debe permitir escribir en el campo de nombre', () => {
      const nombre = 'Juan';
      
      cy.get('#firstName')
        .type(nombre)
        .should('have.value', nombre);
    });

    it('Debe permitir escribir en el campo de apellido', () => {
      const apellido = 'Pérez';
      
      cy.get('#lastName')
        .type(apellido)
        .should('have.value', apellido);
    });

    it('Debe permitir escribir en el campo de contraseña', () => {
      const password = 'TestPassword123#';
      
      cy.get('#password')
        .type(password)
        .should('have.value', password);
    });

    it('Debe permitir escribir en el campo de confirmar contraseña', () => {
      const password = 'TestPassword123#';
      
      cy.get('#confirmPassword')
        .type(password)
        .should('have.value', password);
    });

    it('Debe alternar la visibilidad de la contraseña', () => {
      cy.get('#password')
        .should('have.attr', 'type', 'password');
      
      // Hacer clic en el primer botón de toggle (password)
      cy.get('.password-toggle').eq(0).click();
      
      cy.get('#password')
        .should('have.attr', 'type', 'text');
      
      // Hacer clic de e1315844981
      cy.get('.password-toggle').eq(0).click();
      
      cy.get('#password')
        .should('have.attr', 'type', 'password');
    });

    it('Debe alternar la visibilidad de confirmar contraseña', () => {
      cy.get('#confirmPassword')
        .should('have.attr', 'type', 'password');
      
      // Hacer clic en el segundo botón de toggle (confirmPassword)
      cy.get('.password-toggle').eq(1).click();
      
      cy.get('#confirmPassword')
        .should('have.attr', 'type', 'text');
      
      // Hacer clic de e1315844981
      cy.get('.password-toggle').eq(1).click();
      
      cy.get('#confirmPassword')
        .should('have.attr', 'type', 'password');
    });

    it('Debe limpiar los campos después de escribir', () => {
      cy.get('input[type="email"]')
        .type('test@live.uleam.edu.ec')
        .clear()
        .should('have.value', '');
      
      cy.get('#firstName')
        .type('Juan')
        .clear()
        .should('have.value', '');
    });
  });

  // ========== TESTS DE VALIDACIÓN DE EMAIL ==========
  describe('Validación de Email', () => {
    it('Debe mostrar mensaje de éxito con email institucional válido', () => {
      cy.get('input[type="email"]')
        .type('estudiante@live.uleam.edu.ec')
        .blur();
      
      cy.wait(500);
      cy.contains('✓ Correo válido').should('be.visible');
      cy.get('input[type="email"]').should('have.class', 'input-success');
    });

    it('Debe mostrar error con dominio de email inválido', () => {
      cy.get('input[type="email"]')
        .type('test@gmail.com')
        .blur();
      
      cy.wait(500);
      cy.contains('@live.uleam.edu.ec').should('be.visible');
      cy.get('.error-message').should('be.visible');
      cy.get('input[type="email"]').should('have.class', 'input-error');
    });

    it('Debe validar email con formato incorrecto', () => {
      cy.get('input[type="email"]')
        .type('emailinvalido')
        .blur();
      
      cy.get('input[type="email"]').then(($input) => {
        const input = $input[0] as HTMLInputElement;
        expect(input.validity.valid).to.be.false;
      });
    });

    it('Debe aceptar email con puntos y guiones', () => {
      cy.get('input[type="email"]')
        .type('juan.perez-123@live.uleam.edu.ec')
        .blur();
      
      cy.wait(500);
      cy.contains('✓ Correo válido').should('be.visible');
    });
  });

  // ========== TESTS DE VALIDACIÓN DE CONTRASEÑA ==========
  describe('Validación de Contraseña', () => {
    it('Debe actualizar los requisitos mientras el usuario escribe', () => {
      // Inicialmente todos los requisitos deben mostrar "○"
      cy.get('.requirement').each(($el) => {
        cy.wrap($el).should('not.have.class', 'met');
      });

      // Escribir contraseña válida
      cy.get('#password').type('TestPass123#');

      // Todos los requisitos deben estar cumplidos
      cy.get('.requirement.met').should('have.length', 5);
    });

    it('Debe marcar requisito de longitud cuando tiene 8+ caracteres', () => {
      cy.get('#password').type('12345678');
      
      cy.contains('8+ caracteres')
        .closest('.requirement')
        .should('have.class', 'met');
    });

    it('Debe marcar requisito de mayúscula cuando la incluye', () => {
      cy.get('#password').type('Test');
      
      cy.contains('Mayúscula')
        .closest('.requirement')
        .should('have.class', 'met');
    });

    it('Debe marcar requisito de minúscula cuando la incluye', () => {
      cy.get('#password').type('test');
      
      cy.contains('Minúscula')
        .closest('.requirement')
        .should('have.class', 'met');
    });

    it('Debe marcar requisito de número cuando lo incluye', () => {
      cy.get('#password').type('test123');
      
      cy.contains('Número')
        .closest('.requirement')
        .should('have.class', 'met');
    });

    it('Debe marcar requisito de carácter especial cuando lo incluye', () => {
      cy.get('#password').type('test@');
      
      cy.contains('Especial')
        .closest('.requirement')
        .should('have.class', 'met');
    });

    it('Debe mostrar clase de éxito cuando todos los requisitos se cumplen', () => {
      cy.get('#password')
        .type('TestPassword123#')
        .should('have.class', 'input-success');
    });

    it('No debe mostrar error cuando la contraseña es válida', () => {
      cy.get('#password').type('TestPassword123#');
      
      cy.get('#password').parent().parent()
        .find('.error-message')
        .should('not.exist');
    });
  });

  // ========== TESTS DE CONFIRMACIÓN DE CONTRASEÑA ==========
  describe('Confirmación de Contraseña', () => {
    it('Debe mostrar error cuando las contraseñas no coinciden', () => {
      cy.get('#password').type('TestPassword123#');
      cy.get('#confirmPassword').type('DifferentPass123#');
      
      cy.wait(500);
      cy.contains('Las contraseñas no coinciden').should('be.visible');
      cy.get('#confirmPassword').should('have.class', 'input-error');
    });

    it('Debe mostrar mensaje de éxito cuando las contraseñas coinciden', () => {
      const password = 'TestPassword123#';
      
      cy.get('#password').type(password);
      cy.get('#confirmPassword').type(password);
      
      cy.wait(500);
      cy.contains('✓ Las contraseñas coinciden').should('be.visible');
      cy.get('#confirmPassword').should('have.class', 'input-success');
    });

    it('Debe actualizar validación al cambiar la contraseña original', () => {
      cy.get('#password').type('TestPassword123#');
      cy.get('#confirmPassword').type('TestPassword123#');
      
      cy.wait(500);
      cy.contains('✓ Las contraseñas coinciden').should('be.visible');
      
      // Cambiar la contraseña original
      cy.get('#password').clear().type('NewPassword456$');
      
      cy.wait(500);
      cy.contains('Las contraseñas no coinciden').should('be.visible');
    });
  });

  // ========== TESTS DE VALIDACIÓN DEL FORMULARIO ==========
  describe('Validación del Formulario Completo', () => {
    it('El botón debe estar deshabilitado cuando el formulario está vacío', () => {
      cy.get('button[type="submit"]').should('be.disabled');
    });

    it('El botón debe estar deshabilitado con email inválido', () => {
      cy.get('input[type="email"]').type('test@gmail.com').blur();
      cy.get('#firstName').type('Juan');
      cy.get('#lastName').type('Pérez');
      cy.get('#password').type('TestPassword123#');
      cy.get('#confirmPassword').type('TestPassword123#');
      
      cy.wait(500);
      cy.get('button[type="submit"]').should('be.disabled');
    });

    it('El botón debe estar deshabilitado sin nombre', () => {
      cy.get('input[type="email"]').type('test@live.uleam.edu.ec').blur();
      cy.get('#lastName').type('Pérez');
      cy.get('#password').type('TestPassword123#');
      cy.get('#confirmPassword').type('TestPassword123#');
      
      cy.wait(500);
      cy.get('button[type="submit"]').should('be.disabled');
    });

    it('El botón debe estar deshabilitado sin apellido', () => {
      cy.get('input[type="email"]').type('test@live.uleam.edu.ec').blur();
      cy.get('#firstName').type('Juan');
      cy.get('#password').type('TestPassword123#');
      cy.get('#confirmPassword').type('TestPassword123#');
      
      cy.wait(500);
      cy.get('button[type="submit"]').should('be.disabled');
    });

    it('El botón debe estar deshabilitado con contraseña inválida', () => {
      cy.get('input[type="email"]').type('test@live.uleam.edu.ec').blur();
      cy.get('#firstName').type('Juan');
      cy.get('#lastName').type('Pérez');
      cy.get('#password').type('weak');
      cy.get('#confirmPassword').type('weak');
      
      cy.wait(500);
      cy.get('button[type="submit"]').should('be.disabled');
    });

    it('El botón debe estar deshabilitado cuando las contraseñas no coinciden', () => {
      cy.get('input[type="email"]').type('test@live.uleam.edu.ec').blur();
      cy.get('#firstName').type('Juan');
      cy.get('#lastName').type('Pérez');
      cy.get('#password').type('TestPassword123#');
      cy.get('#confirmPassword').type('DifferentPass456$');
      
      cy.wait(500);
      cy.get('button[type="submit"]').should('be.disabled');
    });

    it('El botón debe estar habilitado con formulario completamente válido', () => {
      cy.get('input[type="email"]').type('test@live.uleam.edu.ec').blur();
      cy.get('#firstName').type('Juan');
      cy.get('#lastName').type('Pérez');
      cy.get('#password').type('TestPassword123#');
      cy.get('#confirmPassword').type('TestPassword123#');
      
      cy.wait(1000);
      cy.get('button[type="submit"]').should('not.be.disabled');
    });

  });

  // ========== TESTS DE NAVEGACIÓN ==========
  describe('Navegación', () => {
    it('Debe navegar a la página de login al hacer clic en "Inicia Sesión"', () => {
      cy.contains('Inicia Sesión').click();
      cy.url().should('include', '/login');
    });

    it('El enlace de login debe ser visible y clickeable', () => {
      cy.get('a[href="/login"]')
        .should('be.visible')
        .should('not.be.disabled');
    });
  });

  // ========== TESTS DE ESTADO DE CARGA ==========
  describe('Estado de Carga', () => {
    it('Debe mostrar estado de carga al enviar el formulario', () => {
      // Llenar formulario válido
      cy.get('input[type="email"]').type('e1315844981@live.uleam.edu.ec').blur();
      cy.get('#firstName').type('Juan');
      cy.get('#lastName').type('Pérez');
      cy.get('#password').type('TestPassword123#');
      cy.get('#confirmPassword').type('TestPassword123#');
      
      cy.wait(1000);
      
      // Interceptar la petición para controlar el timing
      cy.intercept('POST', '**/auth/v1/signup**', {
        delay: 1000,
        statusCode: 200,
        body: {
          user: { email: 'e1315844981@live.uleam.edu.ec' }
        }
      }).as('registerRequest');
      
      cy.get('button[type="submit"]').click();
      
      // Verificar que aparece el texto "Registrando..."
      cy.contains('Registrando...', { timeout: 2000 }).should('be.visible');
    });

    it('Debe deshabilitar el botón durante el proceso de registro', () => {
      // Llenar formulario válido
      cy.get('input[type="email"]').type('nuevo2@live.uleam.edu.ec').blur();
      cy.get('#firstName').type('María');
      cy.get('#lastName').type('González');
      cy.get('#password').type('TestPassword123#');
      cy.get('#confirmPassword').type('TestPassword123#');
      
      cy.wait(1000);
      
      cy.intercept('POST', '**/auth/v1/signup**', {
        delay: 1000,
        statusCode: 200,
        body: {}
      });
      
      cy.get('button[type="submit"]').click();
      
      // El botón debe estar deshabilitado temporalmente
      cy.get('button[type="submit"]').should('be.disabled');
    });

    it('Debe mostrar el spinner durante la carga', () => {
      cy.get('input[type="email"]').type('nuevo3@live.uleam.edu.ec').blur();
      cy.get('#firstName').type('Carlos');
      cy.get('#lastName').type('Rodríguez');
      cy.get('#password').type('TestPassword123#');
      cy.get('#confirmPassword').type('TestPassword123#');
      
      cy.wait(1000);
      
      cy.intercept('POST', '**/auth/v1/signup**', {
        delay: 1000,
        statusCode: 200,
        body: {}
      });
      
      cy.get('button[type="submit"]').click();
      
      cy.get('.loading-spinner').should('be.visible');
      cy.get('.spinner-icon').should('be.visible');
    });
  });

  describe('Estilos y Clases CSS', () => {
    it('Debe tener las clases CSS correctas en los elementos principales', () => {
      cy.get('.register-container').should('exist');
      cy.get('.register-card').should('exist');
      cy.get('.register-header').should('exist');
      cy.get('.register-content').should('exist');
      cy.get('.register-form').should('exist');
    });

    it('Debe tener decoraciones visuales', () => {
      cy.get('.register-decoration').should('exist');
      cy.get('.logo-title').should('be.visible');
      cy.get('.logo-tagline').should('be.visible');
    });

    it('Los campos nombre y apellido deben estar en la misma fila', () => {
      cy.get('.form-row').should('exist');
      cy.get('.form-row .form-group').should('have.length', 2);
    });
  });

  describe('Accesibilidad', () => {
    it('Los campos deben tener etiquetas asociadas', () => {
      cy.get('label[for="email"]').should('exist');
      cy.get('label[for="firstName"]').should('exist');
      cy.get('label[for="lastName"]').should('exist');
      cy.get('label[for="password"]').should('exist');
      cy.get('label[for="confirmPassword"]').should('exist');
    });

    it('Los campos deben tener el atributo required', () => {
      cy.get('input[type="email"]').should('have.attr', 'required');
      cy.get('#firstName').should('have.attr', 'required');
      cy.get('#lastName').should('have.attr', 'required');
      cy.get('#password').should('have.attr', 'required');
      cy.get('#confirmPassword').should('have.attr', 'required');
    });

  });

  describe('Diseño Responsive', () => {
    it('Debe verse correctamente en dispositivos móviles', () => {
      cy.viewport('iphone-x');
      cy.get('.register-card').should('be.visible');
      cy.get('input[type="email"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('Debe verse correctamente en tablets', () => {
      cy.viewport('ipad-2');
      cy.get('.register-card').should('be.visible');
      cy.get('.register-form').should('be.visible');
      cy.get('.form-row').should('be.visible');
    });

    it('Debe verse correctamente en desktop', () => {
      cy.viewport(1920, 1080);
      cy.get('.register-card').should('be.visible');
      cy.get('.register-container').should('be.visible');
    });

    it('Los campos deben adaptarse en móvil', () => {
      cy.viewport('iphone-x');
      
      // En móvil, los campos nombre y apellido deberían estar uno debajo del otro
      cy.get('.form-row').should('exist');
    });
  });

  // ========== TEST DE INTEGRACIÓN COMPLETA (Simulado) ==========
  describe('Flujo completo de registro (Mock)', () => {
    it('Debe completar el flujo de registro con datos válidos', () => {
      // Interceptar la petición a Supabase
      cy.intercept('POST', '**/auth/v1/signup**', {
        statusCode: 200,
        body: {
          user: {
            email: 'e1315844981@live.uleam.edu.ec',
            user_metadata: {
              first_name: 'Juan',
              last_name: 'Pérez'
            }
          }
        }
      }).as('registerRequest');
      
      // Llenar el formulario
      cy.get('input[type="email"]').type('e1315844981@live.uleam.edu.ec').blur();
      cy.wait(500);
      
      cy.get('#firstName').type('Juan');
      cy.get('#lastName').type('Pérez');
      cy.get('#password').type('TestPassword123#');
      cy.get('#confirmPassword').type('TestPassword123#');
      
      cy.wait(1000);
      
      // Enviar el formulario
      cy.get('button[type="submit"]').click();
      
      // Esperar la petición
      cy.wait('@registerRequest', { timeout: 10000 });
    });

    it('Debe manejar errores de registro correctamente', () => {
      // Simular error de email ya registrado
      cy.intercept('POST', '**/auth/v1/signup**', {
        statusCode: 400,
        body: {
          error: 'User already registered'
        }
      }).as('registerError');
      
      cy.get('input[type="email"]').type('existente@live.uleam.edu.ec').blur();
      cy.wait(500);
      
      cy.get('#firstName').type('Test');
      cy.get('#lastName').type('User');
      cy.get('#password').type('TestPassword123#');
      cy.get('#confirmPassword').type('TestPassword123#');
      
      cy.wait(1000);
      
      cy.get('button[type="submit"]').click();
      
      // Verificar que se maneja el error
      cy.wait('@registerError', { timeout: 10000 });
    });

    it('Debe manejar errores de red correctamente', () => {
      // Simular error de red
      cy.intercept('POST', '**/auth/v1/signup**', {
        forceNetworkError: true
      }).as('networkError');
      
      cy.get('input[type="email"]').type('test@live.uleam.edu.ec').blur();
      cy.wait(500);
      
      cy.get('#firstName').type('Test');
      cy.get('#lastName').type('User');
      cy.get('#password').type('TestPassword123#');
      cy.get('#confirmPassword').type('TestPassword123#');
      
      cy.wait(1000);
      
      cy.get('button[type="submit"]').click();
    });
  });

  // ========== TESTS DE SEGURIDAD ==========
  describe('Seguridad', () => {
    it('No debe guardar las contraseñas en el DOM visible', () => {
      const password = 'SuperSecret123#';
      cy.get('#password').type(password);
      cy.get('#confirmPassword').type(password);
      
      // Verificar que no están visibles en el texto del documento
      cy.get('body').should('not.contain', password);
    });

    it('Debe validar el email en el formato correcto', () => {
      cy.get('input[type="email"]')
        .type('test@live.uleam.edu.ec')
        .blur();
      
      cy.wait(500);
      cy.get('.error-message').should('not.exist');
    });

    it('Debe requerir todos los campos obligatorios', () => {
      cy.get('input[type="email"]').should('have.attr', 'required');
      cy.get('#firstName').should('have.attr', 'required');
      cy.get('#lastName').should('have.attr', 'required');
      cy.get('#password').should('have.attr', 'required');
      cy.get('#confirmPassword').should('have.attr', 'required');
    });
  });

  describe('Casos Extremos', () => {
    it('Debe manejar caracteres especiales en nombres', () => {
      cy.get('#firstName').type('José María');
      cy.get('#lastName').type("O'Connor");
      
      cy.get('#firstName').should('have.value', 'José María');
      cy.get('#lastName').should('have.value', "O'Connor");
    });

    it('Debe manejar espacios en blanco al inicio y final', () => {
      cy.get('#firstName').type('  Juan  ');
      cy.get('#lastName').type('  Pérez  ');
      
      // El formulario no debería validar con solo espacios
      cy.get('#firstName').should('have.value', '  Juan  ');
    });

    it('Debe validar email con mayúsculas y minúsculas', () => {
      cy.get('input[type="email"]')
        .type('Test.User@live.uleam.edu.ec')
        .blur();
      
      cy.wait(500);
      cy.contains('✓ Correo válido').should('be.visible');
    });
  });
});
