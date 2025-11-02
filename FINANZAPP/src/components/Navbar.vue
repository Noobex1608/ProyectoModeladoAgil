<template>
    <header>
  <nav>
    <div class="logo">
      <router-link to="/">FINANZAPP</router-link>
    </div>

    <ul class="nav-links">
      <router-link to="/">Inicio</router-link>
      <router-link to="#acerca-de">Acerca de</router-link>
      <router-link to="#servicios">Servicios</router-link>
      <router-link to="#contacto">Contacto</router-link>
      
      <!-- Mostrar según estado de autenticación -->
      <template v-if="isAuthenticated">
        <span class="user-email">{{ userEmail }}</span>
        <button @click="handleLogout" class="logout-nav-button">Cerrar Sesión</button>
      </template>
      <template v-else>
        <router-link to="/login" class="login-nav-link">Iniciar Sesión</router-link>
        <router-link to="/register" class="register-nav-link">Registrarse</router-link>
      </template>
    </ul>

    <button class="menu-toggle" aria-label="Abrir menú">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </nav>
</header>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { checkAuth, logout, getUserEmail } = useAuth();

const isAuthenticated = ref(false);
const userEmail = ref('');

// Verificar autenticación al montar el componente
onMounted(async () => {
  isAuthenticated.value = await checkAuth();
  if (isAuthenticated.value) {
    userEmail.value = getUserEmail.value;
  }
});

// Actualizar el estado cuando cambie la ruta
router.afterEach(async () => {
  isAuthenticated.value = await checkAuth();
  if (isAuthenticated.value) {
    userEmail.value = getUserEmail.value;
  }
});

const handleLogout = async () => {
  await logout();
  isAuthenticated.value = false;
  userEmail.value = '';
  router.push('/');
};
</script>

<style scoped>
header {
  background: linear-gradient(135deg, #35495e 0%, #2c3e50 100%);
  padding: 1rem 2rem;
  color: white;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo a {
  color: white;
  font-size: 1.3rem;
  text-decoration: none;
  font-family:  'Arial Black', sans-serif;
  transition: color 0.3s ease;
}
.logo a:hover {
  color: #A2D3C7;
}
.nav-links {
  list-style: none;
  display: flex;
  gap: 1rem;
  align-items: center;
}
.nav-links a {
  color: white;
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.3s ease;
  font-weight: 600;
}
.nav-links a:hover {
  color: #A2D3C7;
}
.user-email {
  color: #A2D3C7;
  font-weight: 600;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
}
.login-nav-link {
  background: linear-gradient(135deg, #A2D3C7, #8BC9BD);
  padding: 6px 16px !important;
  border-radius: 20px;
  color: #35495e !important;
  font-weight: 700 !important;
  font-size: 0.85rem !important;
  transition: all 0.3s ease;
}
.login-nav-link:hover {
  background: linear-gradient(135deg, #8BC9BD, #A2D3C7);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(162, 211, 199, 0.4);
  color: #2c3e50 !important;
}
.register-nav-link {
  background: linear-gradient(135deg, #EF8E7D, #E2AA87);
  padding: 6px 16px !important;
  border-radius: 20px;
  color: white !important;
  font-weight: 700 !important;
  font-size: 0.85rem !important;
  transition: all 0.3s ease;
}
.register-nav-link:hover {
  background: linear-gradient(135deg, #E2AA87, #EF8E7D);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 142, 125, 0.4);
}
.logout-nav-button {
  background: linear-gradient(135deg, #EF8E7D, #E2AA87);
  padding: 6px 16px;
  border-radius: 20px;
  color: white;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Arial Black', sans-serif;
  font-size: 0.85rem;
}
.logout-nav-button:hover {
  background: linear-gradient(135deg, #E2AA87, #EF8E7D);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 142, 125, 0.4);
}
.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 0.3rem;
  background: none;
  border: none;
  cursor: pointer;
}
.menu-toggle span {
  width: 25px;
  height: 3px;
  background-color: white;
  border-radius: 2px;
}
ul{
  font-family: 'Arial Black', sans-serif;
  font-size: 0.5rem;
}
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  .menu-toggle {
    display: flex;
  }
}

</style>