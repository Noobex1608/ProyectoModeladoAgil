import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Homepage from '../../pages/homepage.vue'

describe('Homepage.vue', () => {
  it('muestra el mensaje correctamente', () => {
    const wrapper = mount(Homepage)
    expect(wrapper.text()).toContain('Tu aliado financiero  ¡Bienvenido a FINANZAPP!  Donde puedes manejar tus finanzas de manera fácil y rápida Empezar Ahora100%GratuitoSeguroTus datos protegidos24/7Siempre disponibleNuestras CaracterísticasTodo lo que necesitas para gestionar tu dineroRegistro de ingresos y gastosOrganiza tus transacciones con categorías personalizadas y mantén un control detalladoVisualización de balance actualConsulta tu situación financiera en tiempo real y proyecta tus finanzas futurasHistorial de transaccionesAccede a tu historial completo con filtros avanzados y búsqueda inteligente')
  })
})
