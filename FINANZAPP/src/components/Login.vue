<template>
  <div class="login-container">
    <div class="login-decoration"></div>

    <div class="login-card">
      <div class="login-header">
        <h1 class="logo-title">FINANZAPP</h1>
        <p class="logo-tagline">Tu aliado financiero</p>
      </div>

      <div class="login-content">
        <h2 class="welcome-title">¡Bienvenido!</h2>

        <!-- Alertas de error -->
        <div v-if="errorMessage" class="alert alert-error">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{{ errorMessage }}</span>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email" class="form-label">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              data-testid="email"
              v-model="email"
              placeholder="tu@live.uleam.edu.ec"
              class="form-input"
              :class="{ 'input-error': emailError }"
              required
            />
            <span v-if="emailError" class="field-error">{{ emailError }}</span>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Contraseña</label>
            <div class="password-wrapper">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                data-testid="password"
                v-model="password"
                placeholder="••••••••"
                class="form-input"
                :class="{ 'input-error': passwordError }"
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
            <span v-if="passwordError" class="field-error">{{ passwordError }}</span>
          </div>

          <div class="form-options">
            <label class="remember-me">
              <input
                type="checkbox"
                v-model="rememberMe"
                class="checkbox-input"
              />
              <span class="checkbox-label">Recordarme</span>
            </label>
            <p ><router-link to="/forgot-password" class="forgot-password">¿Olvidaste tu contraseña?</router-link></p>
          </div>

          <button type="submit" id="btn-login" data-testid="btn-login" class="login-button" :disabled="isLoading">
            <span v-if="!isLoading">Iniciar Sesión</span>
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
              Iniciando...
            </span>
          </button>
        </form>

        <div class="signup-prompt">
          <p>
            ¿No tienes cuenta? <router-link to="/register" class="signup-link">Regístrate</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../lib/conectionWithSupabase";
const router = useRouter();

const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");
const emailError = ref("");
const passwordError = ref("");

// Al cargar el componente, verificar si hay credenciales guardadas
onMounted(() => {
  const savedEmail = localStorage.getItem("rememberEmail");
  const savedRememberMe = localStorage.getItem("rememberMe");

  if (savedEmail && savedRememberMe === "true") {
    email.value = savedEmail;
    rememberMe.value = true;
  }
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

/**
 * Validar que el correo sea del dominio institucional
 */
const validarDominioCorreo = (correo: string): boolean => {
  const dominioPermitido = "@live.uleam.edu.ec";
  return correo.toLowerCase().endsWith(dominioPermitido);
};

/**
 * Limpiar mensajes de error
 */
const limpiarErrores = () => {
  errorMessage.value = "";
  emailError.value = "";
  passwordError.value = "";
};

const handleLogin = async () => {
  // Limpiar errores anteriores
  limpiarErrores();

  // Validar dominio del correo ANTES de intentar login
  if (!validarDominioCorreo(email.value)) {
    errorMessage.value = "Solo se permiten correos con dominio @live.uleam.edu.ec";
    emailError.value = "Dominio de correo no válido";
    return;
  }

  isLoading.value = true;

  try {
    // Intentar login con Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) {
      console.error("Error en login:", error);
      isLoading.value = false;

      // Manejar diferentes tipos de errores de Supabase
      switch (error.message) {
        case "Invalid login credentials":
          // Verificar si el email existe en la base de datos
          const { data: userData } = await supabase
            .from("profiles")
            .select("email")
            .eq("email", email.value)
            .single();

          if (userData) {
            // El email existe, entonces la contraseña es incorrecta
            errorMessage.value = "Contraseña incorrecta. Por favor, verifica tus credenciales.";
            passwordError.value = "Contraseña incorrecta";
          } else {
            // El email no existe
            errorMessage.value = "El correo electrónico no está registrado.";
            emailError.value = "Correo no registrado";
          }
          break;

        case "Email not confirmed":
          errorMessage.value = "Por favor, confirma tu correo electrónico antes de iniciar sesión.";
          emailError.value = "Email no confirmado";
          break;

        case "Invalid email":
          errorMessage.value = "El formato del correo electrónico no es válido.";
          emailError.value = "Formato inválido";
          break;

        default:
          errorMessage.value = `Error al iniciar sesión: ${error.message}`;
      }
      return;
    }

    // Login exitoso
    console.log("Login exitoso:", data);

    // Si "Recordarme" está activado, guardar el email en localStorage
    if (rememberMe.value) {
      localStorage.setItem("rememberEmail", email.value);
      localStorage.setItem("rememberMe", "true");
    } else {
      // Si no está activado, eliminar los datos guardados
      localStorage.removeItem("rememberEmail");
      localStorage.removeItem("rememberMe");
    }

    // Guardar información de sesión
    const userEmail = data.user?.email || email.value;
    const accessToken = data.session?.access_token || "";

    if (rememberMe.value) {
      // Si "Recordarme" está activado, usar localStorage (persistente)
      localStorage.setItem("authToken", accessToken);
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("isAuthenticated", "true");
    } else {
      // Si no, usar sessionStorage (solo dura la sesión del navegador)
      sessionStorage.setItem("authToken", accessToken);
      sessionStorage.setItem("userEmail", userEmail);
      sessionStorage.setItem("isAuthenticated", "true");
    }

    isLoading.value = false;

    // Mostrar mensaje de éxito
    alert(
      `¡Bienvenido ${userEmail}! ${
        rememberMe.value ? "(Sesión guardada)" : "(Sesión temporal)"
      }`
    );

    // Redirigir a la página principal o dashboard
    router.push("/");
  } catch (error: any) {
    console.error("Error inesperado:", error);
    isLoading.value = false;
    errorMessage.value = "Ocurrió un error inesperado. Por favor, intenta de nuevo.";
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

.login-container {
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

.login-decoration {
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

.login-decoration::before {
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

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 15px 40px rgba(53, 73, 94, 0.12);
  max-width: 420px;
  width: 100%;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.8);
  animation: fadeIn 0.6s ease-out;
  position: relative;
  z-index: 10;
}

.login-header {
  background: linear-gradient(
    135deg,
    var(--color-acento-vibrante),
    var(--color-acento-suave)
  );
  padding: 24px 30px 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.login-header::before {
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

.logo-section {
  position: relative;
  z-index: 2;
}

.logo-title {
  font-size: 1.8rem;
  font-weight: 900;
  color: white;
  margin-bottom: 4px;
  font-family: "Arial Black", sans-serif;
  letter-spacing: 1px;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

.logo-tagline {
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.85rem;
  font-weight: 600;
}

.login-content {
  padding: 24px 30px;
}

.welcome-title {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--color-texto-oscuro);
  margin-bottom: 20px;
  text-align: center;
}

/* Alertas de error */
.alert {
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
  animation: fadeIn 0.3s ease-out;
}

.alert-error {
  background-color: #fee;
  border: 1px solid #fcc;
  color: #c33;
}

.alert svg {
  flex-shrink: 0;
}

/* Mensajes de error en campos */
.field-error {
  display: block;
  color: #c33;
  font-size: 0.8rem;
  margin-top: 6px;
  font-weight: 500;
}

.input-error {
  border-color: #c33 !important;
  background-color: #fff5f5 !important;
}

.welcome-subtitle {
  color: var(--color-texto-oscuro);
  opacity: 0.7;
  text-align: center;
  margin-bottom: 32px;
  font-size: 0.95rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-weight: 700;
  color: var(--color-texto-oscuro);
  font-size: 0.85rem;
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid var(--color-fondo-secundario);
  border-radius: 10px;
  font-size: 0.95rem;
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -4px;
  margin-bottom: 4px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--color-acento-vibrante);
}

.checkbox-label {
  font-size: 0.85rem;
  color: var(--color-texto-oscuro);
  font-weight: 600;
}

.forgot-password {
  color: var(--color-acento-vibrante);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 700;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: var(--color-acento-suave);
  text-decoration: underline;
}

.login-button {
  background: linear-gradient(135deg, var(--color-cta), #8bc9bd);
  color: var(--color-texto-oscuro);
  border: none;
  padding: 12px 28px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(162, 211, 199, 0.3);
  margin-top: 4px;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(162, 211, 199, 0.4);
  background: linear-gradient(135deg, #8bc9bd, var(--color-cta));
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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

.divider {
  position: relative;
  text-align: center;
  margin: 24px 0;
}

.divider::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 1px;
  background: var(--color-fondo-secundario);
}

.divider-text {
  position: relative;
  background: white;
  padding: 0 16px;
  color: var(--color-texto-oscuro);
  opacity: 0.6;
  font-size: 0.9rem;
  font-weight: 600;
}

.social-login {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.social-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: 2px solid var(--color-fondo-secundario);
  border-radius: 12px;
  background: white;
  color: var(--color-texto-oscuro);
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.social-button:hover {
  border-color: var(--color-acento-suave);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(226, 170, 135, 0.2);
}

.google-button:hover {
  background: #f8f9fa;
}

.github-button:hover {
  background: #24292e;
  color: white;
  border-color: #24292e;
}

.signup-prompt {
  text-align: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--color-fondo-secundario);
}

.signup-prompt p {
  color: var(--color-texto-oscuro);
  opacity: 0.7;
  font-size: 0.85rem;
}

.signup-link {
  color: var(--color-acento-vibrante);
  text-decoration: none;
  font-weight: 700;
  transition: color 0.3s ease;
}

.signup-link:hover {
  color: var(--color-acento-suave);
  text-decoration: underline;
}

.login-footer {
  background: linear-gradient(
    to bottom,
    rgba(254, 247, 225, 0.3),
    rgba(237, 216, 187, 0.5)
  );
  padding: 24px 40px;
  border-top: 2px solid rgba(226, 170, 135, 0.2);
}

.features-list {
  display: flex;
  justify-content: space-around;
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-texto-oscuro);
  font-size: 0.85rem;
  font-weight: 600;
  opacity: 0.8;
}

.feature-item svg {
  color: var(--color-cta);
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .login-card {
    border-radius: 20px;
    max-width: 100%;
  }

  .login-header {
    padding: 20px 24px 16px;
  }

  .logo-title {
    font-size: 1.5rem;
  }

  .login-content {
    padding: 20px 24px;
  }

  .welcome-title {
    font-size: 1.3rem;
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
