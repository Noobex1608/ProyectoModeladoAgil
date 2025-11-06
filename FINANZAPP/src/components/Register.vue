<template>
  <div class="register-container">
    <div class="register-decoration"></div>

    <div class="register-card">
      <div class="register-header">
        <h1 class="logo-title">FINANZAPP</h1>
        <p class="logo-tagline">Tu aliado financiero</p>
      </div>

      <div class="register-content">
        <h2 class="welcome-title">Crear Cuenta</h2>

        <form @submit.prevent="handleRegister" class="register-form">
          <!-- Correo Institucional -->
          <div class="form-group">
            <label for="email" class="form-label">Correo Institucional</label>
            <input
              type="email"
              id="email"
              v-model="email"
              @blur="validateEmail"
              placeholder="tu.nombre@live.uleam.edu.ec"
              class="form-input"
              :class="{
                'input-error': emailError,
                'input-success': emailValid,
              }"
              required
            />
            <span v-if="emailError" class="error-message">{{
              emailError
            }}</span>
            <span v-if="emailValid && !emailError" class="success-message">
              ✓ Correo válido
            </span>
          </div>

          <!-- Nombre y Apellido en la misma fila -->
          <div class="form-row">
            <div class="form-group">
              <label for="firstName" class="form-label">Nombre</label>
              <input
                type="text"
                id="firstName"
                v-model="firstName"
                placeholder="Juan"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label for="lastName" class="form-label">Apellido</label>
              <input
                type="text"
                id="lastName"
                v-model="lastName"
                placeholder="Pérez"
                class="form-input"
                required
              />
            </div>
          </div>

          <!-- Contraseña -->
          <div class="form-group">
            <label for="password" class="form-label">Contraseña</label>
            <div class="password-wrapper">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                @input="validatePassword"
                placeholder="••••••••"
                class="form-input"
                :class="{
                  'input-error': passwordError,
                  'input-success': passwordValid,
                }"
                required
              />
              <button
                type="button"
                @click="togglePassword"
                class="password-toggle"
                aria-label="Mostrar contraseña"
              >
                <svg
                  v-if="!showPassword"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <svg
                  v-else
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
                  />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              </button>
            </div>

            <!-- Indicadores de requisitos de contraseña - Compacto -->
            <div class="password-requirements">
              <div class="requirement" :class="{ met: requirements.length }">
                <span class="requirement-icon">{{
                  requirements.length ? "✓" : "○"
                }}</span>
                8+ caracteres
              </div>
              <div class="requirement" :class="{ met: requirements.uppercase }">
                <span class="requirement-icon">{{
                  requirements.uppercase ? "✓" : "○"
                }}</span>
                Mayúscula
              </div>
              <div class="requirement" :class="{ met: requirements.lowercase }">
                <span class="requirement-icon">{{
                  requirements.lowercase ? "✓" : "○"
                }}</span>
                Minúscula
              </div>
              <div class="requirement" :class="{ met: requirements.number }">
                <span class="requirement-icon">{{
                  requirements.number ? "✓" : "○"
                }}</span>
                Número
              </div>
              <div class="requirement" :class="{ met: requirements.special }">
                <span class="requirement-icon">{{
                  requirements.special ? "✓" : "○"
                }}</span>
                Especial
              </div>
            </div>
          </div>

          <!-- Verificar Contraseña -->
          <div class="form-group">
            <label for="confirmPassword" class="form-label"
              >Confirmar Contraseña</label
            >
            <div class="password-wrapper">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                id="confirmPassword"
                v-model="confirmPassword"
                @input="validateConfirmPassword"
                placeholder="••••••••"
                class="form-input"
                :class="{
                  'input-error': confirmPasswordError,
                  'input-success': confirmPasswordValid,
                }"
                required
              />
              <button
                type="button"
                @click="toggleConfirmPassword"
                class="password-toggle"
                aria-label="Mostrar contraseña"
              >
                <svg
                  v-if="!showConfirmPassword"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <svg
                  v-else
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
                  />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              </button>
            </div>
            <span v-if="confirmPasswordError" class="error-message">{{
              confirmPasswordError
            }}</span>
            <span
              v-if="confirmPasswordValid && !confirmPasswordError"
              class="success-message"
            >
              ✓ Las contraseñas coinciden
            </span>
          </div>

          <button
            type="submit"
            class="register-button"
            :disabled="isLoading || !isFormValid"
          >
            <span v-if="!isLoading">Crear Cuenta</span>
            <span v-else class="loading-spinner">
              <svg
                class="spinner-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  class="spinner-circle"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
              </svg>
              Registrando...
            </span>
          </button>
        </form>

        <div class="login-prompt">
          <p>
            ¿Ya tienes cuenta?
            <router-link to="/login" class="login-link"
              >Inicia Sesión</router-link
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../lib/conectionWithSupabase";

const router = useRouter();

// Datos del formulario
const email = ref("");
const firstName = ref("");
const lastName = ref("");
const password = ref("");
const confirmPassword = ref("");

// Estados de visibilidad
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isLoading = ref(false);

// Estados de validación
const emailError = ref("");
const emailValid = ref(false);
const passwordError = ref("");
const passwordValid = ref(false);
const confirmPasswordError = ref("");
const confirmPasswordValid = ref(false);

// Requisitos de contraseña
const requirements = computed(() => ({
  length: password.value.length >= 8,
  uppercase: /[A-Z]/.test(password.value),
  lowercase: /[a-z]/.test(password.value),
  number: /[0-9]/.test(password.value),
  special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password.value),
}));

// Validar correo institucional
const validateEmail = () => {
  const emailPattern = /^[a-zA-Z0-9._-]+@live\.uleam\.edu\.ec$/;

  if (!email.value) {
    emailError.value = "";
    emailValid.value = false;
    return;
  }

  if (!emailPattern.test(email.value)) {
    emailError.value = "Debe usar un correo institucional (@live.uleam.edu.ec)";
    emailValid.value = false;
  } else {
    emailError.value = "";
    emailValid.value = true;
  }
};

// Validar contraseña
const validatePassword = () => {
  if (!password.value) {
    passwordError.value = "";
    passwordValid.value = false;
    return;
  }

  const allRequirementsMet =
    requirements.value.length &&
    requirements.value.uppercase &&
    requirements.value.lowercase &&
    requirements.value.number &&
    requirements.value.special;

  if (!allRequirementsMet) {
    passwordError.value = "La contraseña no cumple todos los requisitos";
    passwordValid.value = false;
  } else {
    passwordError.value = "";
    passwordValid.value = true;
  }

  // Re-validar confirmación si ya se escribió algo
  if (confirmPassword.value) {
    validateConfirmPassword();
  }
};

// Validar confirmación de contraseña
const validateConfirmPassword = () => {
  if (!confirmPassword.value) {
    confirmPasswordError.value = "";
    confirmPasswordValid.value = false;
    return;
  }

  if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = "Las contraseñas no coinciden";
    confirmPasswordValid.value = false;
  } else {
    confirmPasswordError.value = "";
    confirmPasswordValid.value = true;
  }
};

// Validar si el formulario es válido
const isFormValid = computed(() => {
  return (
    emailValid.value &&
    firstName.value.trim() !== "" &&
    lastName.value.trim() !== "" &&
    passwordValid.value &&
    confirmPasswordValid.value &&
    !emailError.value &&
    !passwordError.value &&
    !confirmPasswordError.value
  );
});

// Toggle visibilidad de contraseña
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// Manejar registro
const handleRegister = async () => {
  // Validar todo antes de enviar
  validateEmail();
  validatePassword();
  validateConfirmPassword();

  if (!isFormValid.value) {
    return;
  }

  isLoading.value = true;

  try {
    // Registrar con Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          first_name: firstName.value,
          last_name: lastName.value,
          full_name: `${firstName.value} ${lastName.value}`,
        },
      },
    });

    if (error) {
      console.error("Error en registro:", error);
      alert(`Error al registrar: ${error.message}`);
      isLoading.value = false;
      return;
    }

    // Registro exitoso
    console.log("Registro exitoso:", data);

    alert(
      `¡Bienvenido ${firstName.value} ${lastName.value}!\n\nTu cuenta ha sido creada exitosamente.\n\nPor favor, revisa tu correo electrónico para confirmar tu cuenta.`
    );

    // Redirigir al login
    router.push("/login");
  } catch (error: any) {
    console.error("Error inesperado:", error);
    alert("Ocurrió un error inesperado. Por favor, intenta de nuevo.");
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.register-container {
  min-height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    var(--color-fondo-principal) 0%,
    var(--color-fondo-secundario) 50%,
    var(--color-acento-suave) 100%
  );
  padding: 30px 20px;
  position: relative;
  overflow: hidden;
}

.register-decoration {
  position: absolute;
  top: -20%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(
    circle,
    rgba(239, 142, 125, 0.15) 0%,
    transparent 70%
  );
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.register-decoration::before {
  content: "";
  position: absolute;
  bottom: -30%;
  left: -50%;
  width: 500px;
  height: 500px;
  background: radial-gradient(
    circle,
    rgba(162, 211, 199, 0.2) 0%,
    transparent 70%
  );
  border-radius: 50%;
  animation: float 8s ease-in-out infinite reverse;
}

.register-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 15px 40px rgba(53, 73, 94, 0.12);
  max-width: 500px;
  width: 100%;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.8);
  animation: fadeIn 0.6s ease-out;
  position: relative;
  z-index: 10;
}

.register-header {
  background: linear-gradient(
    135deg,
    var(--color-acento-vibrante),
    var(--color-acento-suave)
  );
  padding: 20px 30px 16px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.register-header::before {
  content: "";
  position: absolute;
  top: -50%;
  right: -20%;
  width: 300px;
  height: 300px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.2) 0%,
    transparent 70%
  );
  border-radius: 50%;
}

.logo-title {
  font-size: 1.6rem;
  font-weight: 900;
  color: white;
  margin-bottom: 2px;
  font-family: "Arial Black", sans-serif;
  letter-spacing: 1px;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;
}

.logo-tagline {
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.8rem;
  font-weight: 600;
  position: relative;
  z-index: 2;
}

.register-content {
  padding: 20px 30px;
}

.welcome-title {
  font-size: 1.3rem;
  font-weight: 900;
  color: var(--color-texto-oscuro);
  margin-bottom: 16px;
  text-align: center;
}

.welcome-subtitle {
  color: var(--color-texto-oscuro);
  opacity: 0.7;
  text-align: center;
  margin-bottom: 24px;
  font-size: 0.9rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-label {
  font-weight: 700;
  color: var(--color-texto-oscuro);
  font-size: 0.8rem;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid var(--color-fondo-secundario);
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--color-texto-oscuro);
  background: white;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-acento-vibrante);
  box-shadow: 0 0 0 4px rgba(239, 142, 125, 0.1);
}

.form-input::placeholder {
  color: rgba(53, 73, 94, 0.4);
}

.input-error {
  border-color: #e74c3c !important;
}

.input-error:focus {
  box-shadow: 0 0 0 4px rgba(231, 76, 60, 0.1) !important;
}

.input-success {
  border-color: #27ae60 !important;
}

.input-success:focus {
  box-shadow: 0 0 0 4px rgba(39, 174, 96, 0.1) !important;
}

.error-message {
  color: #e74c3c;
  font-size: 0.7rem;
  font-weight: 600;
  margin-top: 1px;
}

.success-message {
  color: #27ae60;
  font-size: 0.7rem;
  font-weight: 600;
  margin-top: 1px;
}

.password-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-acento-suave);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: var(--color-acento-vibrante);
}

.password-requirements {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-top: 6px;
  padding: 8px;
  background: rgba(237, 216, 187, 0.2);
  border-radius: 6px;
}

.requirement {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
  color: #7f8c8d;
  transition: all 0.3s ease;
}

.requirement.met {
  color: #27ae60;
  font-weight: 600;
}

.requirement-icon {
  font-weight: 700;
  font-size: 0.75rem;
}

.register-button {
  background: linear-gradient(135deg, var(--color-cta), #8bc9bd);
  color: var(--color-texto-oscuro);
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(162, 211, 199, 0.3);
  margin-top: 4px;
}

.register-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(162, 211, 199, 0.4);
  background: linear-gradient(135deg, #8bc9bd, var(--color-cta));
}

.register-button:active:not(:disabled) {
  transform: translateY(0);
}

.register-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: linear-gradient(135deg, #ccc, #999);
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spinner-icon {
  animation: spin 1s linear infinite;
}

.spinner-circle {
  stroke-dasharray: 50;
  stroke-dashoffset: 25;
}

.login-prompt {
  text-align: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--color-fondo-secundario);
}

.login-prompt p {
  color: var(--color-texto-oscuro);
  opacity: 0.7;
  font-size: 0.8rem;
}

.login-link {
  color: var(--color-acento-vibrante);
  text-decoration: none;
  font-weight: 700;
  transition: color 0.3s ease;
}

.login-link:hover {
  color: var(--color-acento-suave);
  text-decoration: underline;
}

@media (max-width: 640px) {
  .register-card {
    border-radius: 20px;
    max-width: 100%;
  }

  .register-header {
    padding: 16px 20px 12px;
  }

  .logo-title {
    font-size: 1.4rem;
  }

  .register-content {
    padding: 16px 20px;
  }

  .welcome-title {
    font-size: 1.2rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .password-requirements {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
