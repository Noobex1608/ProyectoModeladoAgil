<template>
    <header>
  <nav>
    <div class="logo">
      <a href="/">FINANZAPP</a>
    </div>

    <ul class="nav-links">
      <router-link to="/">Inicio</router-link>
      <router-link to="#acerca-de">Acerca de</router-link>
      <router-link to="#servicios">Servicios</router-link>
      <router-link to="#contacto">Contacto</router-link>
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
  font-size: 1.5rem;
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
  gap: 1.5rem;
}
.nav-links a {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.3s ease;
  font-weight: 600;
}
.nav-links a:hover {
  color: #A2D3C7;
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