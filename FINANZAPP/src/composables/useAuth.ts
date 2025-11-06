import { computed, ref } from "vue";
import { supabase } from "../lib/conectionWithSupabase";

// Estado global de autenticación
const isAuthenticated = ref(false);
const userEmail = ref("");

export function useAuth() {
  // Verificar si el usuario está autenticado
  const checkAuth = async () => {
    // Primero verificar sesión de Supabase
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      isAuthenticated.value = true;
      userEmail.value = session.user.email || "";

      // Sincronizar con localStorage/sessionStorage
      const rememberMe = localStorage.getItem("rememberMe") === "true";
      if (rememberMe) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", session.user.email || "");
        localStorage.setItem("authToken", session.access_token);
      } else {
        sessionStorage.setItem("isAuthenticated", "true");
        sessionStorage.setItem("userEmail", session.user.email || "");
        sessionStorage.setItem("authToken", session.access_token);
      }

      return true;
    }

    // Si no hay sesión en Supabase, verificar localStorage/sessionStorage
    const localAuth = localStorage.getItem("isAuthenticated");
    const localEmail = localStorage.getItem("userEmail");

    if (localAuth === "true" && localEmail) {
      isAuthenticated.value = true;
      userEmail.value = localEmail;
      return true;
    }

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
  const logout = async () => {
    // Cerrar sesión en Supabase
    await supabase.auth.signOut();

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
