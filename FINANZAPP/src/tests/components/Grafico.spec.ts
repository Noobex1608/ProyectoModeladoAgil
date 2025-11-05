import { mount } from "@vue/test-utils";
import Grafico from "../../components/Grafico.vue";
import { describe, expect, it } from "vitest";

describe("Dashboard Charts", () => {
  it("renderiza gráfico de barras y pastel", () => {
    const wrapper = mount(Grafico);

    expect(wrapper.find("[data-testid='bar-chart']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='pie-chart']").exists()).toBe(true);
  });

  it("muestra mensaje cuando no hay datos", () => {
    const wrapper = mount(Grafico, {
      props: { data: [] }
    });

    expect(wrapper.text()).toContain("No hay datos para mostrar");
  });
});
