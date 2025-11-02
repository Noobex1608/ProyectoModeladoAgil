import { flushPromises, mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { createRouter, createMemoryHistory } from "vue-router";
import Homepage from "../../pages/homepage.vue";
import Login from "../../components/Login.vue";
describe("Homepage.vue", () => {
    let router: any;

    beforeEach(() => {
        // Crear un router mock para las pruebas
        router = createRouter({
            history: createMemoryHistory(),
            routes: [
                { path: "/", component: { template: "<div>Home</div>" } },
                { path: "/login", component: Login },
            ],
        });

        // Limpiar todos los mocks
        vi.clearAllMocks();
    });

    it("Renderiza el componente correctamente", () => {
        const wrapper = mount(Homepage, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.exists()).toBe(true);
    });


    describe("Sección Hero", () => {
        it("Muestra el título principal con FINANZAPP", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            expect(wrapper.find(".hero-title").exists()).toBe(true);
            expect(wrapper.text()).toContain("¡Bienvenido a");
            expect(wrapper.text()).toContain("FINANZAPP");
            expect(wrapper.find(".brand-name").exists()).toBe(true);
        });

        it("Muestra el subtítulo correcto", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            expect(wrapper.find(".hero-subtitle").exists()).toBe(true);
            expect(wrapper.text()).toContain("Donde puedes manejar tus finanzas de manera fácil y rápida");
        });

        it("Muestra el botón 'Empezar Ahora'", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            const ctaButton = wrapper.find(".cta-button");
            expect(ctaButton.exists()).toBe(true);
            expect(ctaButton.text()).toContain("Empezar Ahora");
            expect(ctaButton.attributes("id")).toBe("botonEmpezarAhora");
        });

        it("Redirige a /login cuando se hace clic", async () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            const ctaButton = wrapper.find("#botonEmpezarAhora");
            await ctaButton.trigger("click");
            await flushPromises(); 

            expect(router.currentRoute.value.path).toBe("/login");
        });

    });

    describe("Sección de Características", () => {
        it("Muestra el encabezado de la sección", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            expect(wrapper.find(".section-header").exists()).toBe(true);
            expect(wrapper.find(".section-title").exists()).toBe(true);
            expect(wrapper.text()).toContain("Nuestras Características");
        });

        it("Muestra el subtítulo de la sección", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            expect(wrapper.find(".section-subtitle").exists()).toBe(true);
            expect(wrapper.text()).toContain("Todo lo que necesitas para gestionar tu dinero");
        });

        it("Muestra 3 tarjetas de características", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            const featureCards = wrapper.findAll(".feature-card");
            expect(featureCards.length).toBe(3);
        });

        it("Cada tarjeta tiene un icono", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            const featureIcons = wrapper.findAll(".feature-icon");
            expect(featureIcons.length).toBe(3);
        });

        it("Muestra la característica 'Registro de ingresos y gastos'", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            expect(wrapper.text()).toContain("Registro de ingresos y gastos");
            expect(wrapper.text()).toContain("Organiza tus transacciones con categorías personalizadas");
        });

        it("Muestra la característica 'Visualización de balance actual'", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            expect(wrapper.text()).toContain("Visualización de balance actual");
            expect(wrapper.text()).toContain("Consulta tu situación financiera en tiempo real");
        });

        it("Muestra la característica 'Historial de transacciones'", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            expect(wrapper.text()).toContain("Historial de transacciones");
            expect(wrapper.text()).toContain("Accede a tu historial completo con filtros avanzados");
        });

        it("Cada tarjeta tiene título y descripción", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            const featureTitles = wrapper.findAll(".feature-title");
            const featureDescriptions = wrapper.findAll(".feature-description");

            expect(featureTitles.length).toBe(3);
            expect(featureDescriptions.length).toBe(3);
        });


    });

    describe("Estructura General", () => {
        it("Contiene la sección hero", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            expect(wrapper.find(".hero-section").exists()).toBe(true);
        });

        it("Contiene la sección de características", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            expect(wrapper.find(".features-section").exists()).toBe(true);
        });

    });
});
