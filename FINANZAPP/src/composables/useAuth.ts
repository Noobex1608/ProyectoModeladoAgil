import { computed, ref } from "vue";

// Estado global de autenticación
const isAuthenticated = ref(false);
const userEmail = ref("");

export function useAuth() {
  // Verificar si el usuario está autenticado
  const checkAuth = () => {
    // Primero verificar en localStorage (recordarme activado)
    const localAuth = localStorage.getItem("isAuthenticated");
    const localEmail = localStorage.getItem("userEmail");

    if (localAuth === "true" && localEmail) {
      isAuthenticated.value = true;
      userEmail.value = localEmail;
      return true;
    }

    // Si no está en localStorage, verificar en sessionStorage (sesión temporal)
    const sessionAuth = sessionStorage.getItem("isAuthenticated");
    const sessionEmail = sessionStorage.getItem("userEmail");

    if (sessionAuth === "true" && sessionEmail) {
      isAuthenticated.value = true;
      userEmail.value = sessionEmail;
      return true;
    }

    isAuthenticated.value = false;
    userEmail.value = "";
    return false;
  };

  // Cerrar sesión
  const logout = () => {
    // Limpiar localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAuthenticated");

    // Limpiar sessionStorage
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("isAuthenticated");

    // Mantener el email si "Recordarme" está activado
    const rememberMe = localStorage.getItem("rememberMe");
    if (rememberMe !== "true") {
      localStorage.removeItem("rememberEmail");
      localStorage.removeItem("rememberMe");
    }

    isAuthenticated.value = false;
    userEmail.value = "";
  };

  // Obtener el email del usuario autenticado
  const getUserEmail = computed(() => userEmail.value);

  // Verificar si está autenticado
  const getIsAuthenticated = computed(() => isAuthenticated.value);

  return {
    checkAuth,
    logout,
    getUserEmail,
    getIsAuthenticated,
  };
}
