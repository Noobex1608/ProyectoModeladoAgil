<template>
    <section class="hero-section">
      <div class="hero-decoration"></div>
      <div class="container mx-auto px-4 relative z-10">
        <div class="hero-badge">
           Tu aliado financiero
        </div>
        <h1 class="hero-title">
            ¡Bienvenido a <span class="brand-name">FINANZAPP</span>!
        </h1>
        <p class="hero-subtitle">
            Donde puedes manejar tus finanzas de manera fácil y rápida
        </p>
        <button @click="handleCtaClick" class="cta-button" id="botonEmpezarAhora">
            <span>Empezar Ahora</span>
            <svg class="arrow-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-number">100%</div>
            <div class="stat-label">Gratuito</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">Seguro</div>
            <div class="stat-label">Tus datos protegidos</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">24/7</div>
            <div class="stat-label">Siempre disponible</div>
          </div>
        </div>
      </div>
      <div class="wave-divider">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </section>

    <section class="features-section">
      <div class="container mx-auto px-4">
        <div class="section-header">
          <h2 class="section-title">Nuestras Características</h2>
          <p class="section-subtitle">Todo lo que necesitas para gestionar tu dinero</p>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon icon-1">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <h3 class="feature-title">Registro de ingresos y gastos</h3>
            <p class="feature-description">Organiza tus transacciones con categorías personalizadas y mantén un control detallado</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon icon-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <h3 class="feature-title">Visualización de balance actual</h3>
            <p class="feature-description">Consulta tu situación financiera en tiempo real y proyecta tus finanzas futuras</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon icon-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <path d="M9 22V12h6v10"/>
              </svg>
            </div>
            <h3 class="feature-title">Historial de transacciones</h3>
            <p class="feature-description">Accede a tu historial completo con filtros avanzados y búsqueda inteligente</p>
          </div>
        </div>
      </div>
    </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const handleCtaClick = () => {
    router.push('/login');
};

</script>


<style scoped>


@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes float {
    0%, 100% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-20px);
    }
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
}

.hero-section {
    position: relative;
    background: linear-gradient(135deg, #FEF7E1 0%, #EDD8BB 50%, #E2AA87 100%);
    padding: 100px 0 160px;
    text-align: center;
    overflow: hidden;
}

.hero-decoration {
    position: absolute;
    top: -50%;
    right: -10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(239, 142, 125, 0.15) 0%, transparent 70%);
    border-radius: 50%;
    animation: float 6s ease-in-out infinite;
}

.hero-decoration::before {
    content: '';
    position: absolute;
    top: 20%;
    left: -40%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(162, 211, 199, 0.2) 0%, transparent 70%);
    border-radius: 50%;
    animation: float 8s ease-in-out infinite;
}

.hero-badge {
    display: inline-block;
    background: rgba(255, 255, 255, 0.7);
    border: 2px solid var(--color-cta);
    color: var(--color-texto-oscuro);
    padding: 10px 28px;
    border-radius: 50px;
    font-size: 0.95rem;
    font-weight: 700;
    margin-bottom: 24px;
    animation: fadeInUp 0.8s ease-out;
    box-shadow: 0 4px 15px rgba(162, 211, 199, 0.2);
}

.hero-title {
    font-size: 4rem;
    font-weight: 900;
    color: var(--color-texto-oscuro);
    margin-bottom: 24px;
    line-height: 1.2;
    animation: fadeInUp 0.8s ease-out 0.2s backwards;
}

.brand-name {
    background: linear-gradient(135deg, #EF8E7D, #E2AA87);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: inline-block;
    font-weight: 900;
}

.hero-subtitle {
    font-size: 1.5rem;
    color: var(--color-texto-oscuro);
    max-width: 700px;
    margin: 0 auto 40px;
    opacity: 0.9;
    animation: fadeInUp 0.8s ease-out 0.4s backwards;
}

.cta-button {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: linear-gradient(135deg, var(--color-cta), #8BC9BD);
    color: var(--color-texto-oscuro);
    font-weight: 700;
    font-size: 1.1rem;
    padding: 18px 40px;
    border-radius: 50px;
    border: none;
    cursor: pointer;
    box-shadow: 0 10px 30px rgba(162, 211, 199, 0.4);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    animation: fadeInUp 0.8s ease-out 0.6s backwards;
}

.cta-button:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 15px 40px rgba(239, 142, 125, 0.5);
    background: linear-gradient(135deg, var(--color-acento-vibrante), #E89A89);
    color: white;
}

.arrow-icon {
    transition: transform 0.3s ease;
}

.cta-button:hover .arrow-icon {
    transform: translateX(5px);
}

.hero-stats {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 60px;
    margin-top: 80px;
    animation: fadeInUp 0.8s ease-out 0.8s backwards;
}

.stat-item {
    text-align: center;
    padding: 24px 32px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 20px;
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.8);
    transition: all 0.3s ease;
}

.stat-item:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.7);
    box-shadow: 0 10px 30px rgba(162, 211, 199, 0.3);
}

.stat-number {
    font-size: 2.5rem;
    font-weight: 900;
    color: var(--color-acento-vibrante);
    margin-bottom: 8px;
    text-shadow: 2px 2px 8px rgba(239, 142, 125, 0.2);
}

.stat-label {
    font-size: 1rem;
    color: var(--color-texto-oscuro);
    font-weight: 600;
}

.stat-divider {
    display: none;
}

.wave-divider {
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    overflow: hidden;
    line-height: 0;
    transform: rotate(180deg);
}

.wave-divider svg {
    position: relative;
    display: block;
    width: calc(100% + 1.3px);
    height: 100px;
    fill: var(--color-fondo-secundario);
}

.features-section {
    background: linear-gradient(180deg, var(--color-fondo-secundario) 0%, var(--color-acento-suave) 100%);
    padding: 100px 0;
}

.section-header {
    text-align: center;
    margin-bottom: 60px;
}

.section-title {
    font-size: 3rem;
    font-weight: 900;
    color: var(--color-texto-oscuro);
    margin-bottom: 16px;
}

.section-subtitle {
    font-size: 1.25rem;
    color: var(--color-texto-oscuro);
    opacity: 0.8;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 40px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.feature-card {
    background: rgba(254, 247, 225, 0.95);
    backdrop-filter: blur(10px);
    padding: 40px 30px;
    border-radius: 24px;
    box-shadow: 0 8px 25px rgba(226, 170, 135, 0.2);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border: 3px solid rgba(255, 255, 255, 0.6);
}

.feature-card:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 15px 40px rgba(239, 142, 125, 0.25);
    border-color: var(--color-acento-vibrante);
    background: rgba(255, 255, 255, 0.98);
}

.feature-icon {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    margin-bottom: 24px;
    transition: all 0.4s ease;
}

.feature-card:hover .feature-icon {
    transform: scale(1.1) rotate(5deg);
    animation: pulse 1s ease-in-out infinite;
}

.icon-1 {
    background: linear-gradient(135deg, rgba(162, 211, 199, 0.3), rgba(162, 211, 199, 0.6));
    color: #6BA99A;
}

.icon-2 {
    background: linear-gradient(135deg, rgba(239, 142, 125, 0.3), rgba(239, 142, 125, 0.6));
    color: #D66E5F;
}

.icon-3 {
    background: linear-gradient(135deg, rgba(226, 170, 135, 0.3), rgba(226, 170, 135, 0.6));
    color: #B8845F;
}

.feature-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-texto-oscuro);
    margin-bottom: 16px;
}

.feature-description {
    font-size: 1rem;
    color: var(--color-texto-oscuro);
    opacity: 0.85;
    line-height: 1.6;
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 2.5rem;
    }
    
    .hero-subtitle {
        font-size: 1.1rem;
    }
    
    .hero-stats {
        flex-direction: column;
        gap: 20px;
    }
    
    .stat-divider {
        display: none;
    }
    
    .hero-stats {
        flex-direction: column;
        gap: 20px;
    }
    
    .stat-item {
        width: 100%;
        max-width: 300px;
    }
    
    .features-grid {
        grid-template-columns: 1fr;
    }
    
    .section-title {
        font-size: 2rem;
    }
}
</style>
