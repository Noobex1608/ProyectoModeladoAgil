import { describe, it, expect } from "vitest"
import Graficos from "" // Ruta de la funcion a testear
import { mount } from "@vue/test-utils"

describe("Componente Gráficos", () => {
  it("renderiza gráfico de barras y pastel", () => {
    const wrapper = mount(Graficos)

    expect(wrapper.find('[data-testid="grafico-barras"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="grafico-pastel"]').exists()).toBe(true)
  })
})
