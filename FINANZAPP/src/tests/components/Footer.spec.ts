import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach } from "vitest";
import { createRouter, createMemoryHistory } from "vue-router";
import Footer from "../../components/Footer.vue";

describe("Footer.vue", () => {
    let router: any;

    beforeEach(() => {
        // Crear un router mock para las pruebas
        router = createRouter({
            history: createMemoryHistory(),
            routes: [
                { path: "/", component: { template: "<div>Home</div>" } },
                { path: "/acerca-de", component: { template: "<div>About</div>" } },
                { path: "/servicios", component: { template: "<div>Services</div>" } },
                { path: "/contacto", component: { template: "<div>Contact</div>" } },
                { path: "/privacidad", component: { template: "<div>Privacy</div>" } },
                { path: "/terminos", component: { template: "<div>Terms</div>" } },
            ],
        });
    });

    it("Renderiza el componente correctamente", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.exists()).toBe(true);
        expect(wrapper.find("footer").exists()).toBe(true);
    });

    it("Muestra el título de la marca FINANZAPP", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.text()).toContain("FINANZAPP");
        expect(wrapper.find(".brand-title").exists()).toBe(true);
    });

    it("Muestra la descripción de la marca", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.text()).toContain("La herramienta más simple y efectiva");
        expect(wrapper.find(".brand-description").exists()).toBe(true);
    });

    it("Muestra el año actual en el copyright", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        const currentYear = new Date().getFullYear();
        expect(wrapper.text()).toContain(`© ${currentYear}`);
        expect(wrapper.find(".copyright").exists()).toBe(true);
    });

    it("Muestra la sección de Navegación con sus enlaces", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.text()).toContain("Navegación");
        expect(wrapper.text()).toContain("Inicio");
        expect(wrapper.text()).toContain("Acerca de");
        expect(wrapper.text()).toContain("Servicios");
    });

    it("Muestra la sección de Legal y Ayuda con sus enlaces", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.text()).toContain("Legal y Ayuda");
        expect(wrapper.text()).toContain("Contacto");
        expect(wrapper.text()).toContain("Política de Privacidad");
        expect(wrapper.text()).toContain("Términos de Uso");
    });

    it("Muestra la sección de redes sociales", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.text()).toContain("Síguenos");
        expect(wrapper.find(".social-links").exists()).toBe(true);
    });

    it("Contiene 3 enlaces de redes sociales", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        const socialLinks = wrapper.findAll(".social-link");
        expect(socialLinks.length).toBe(3);
    });

    it("Los enlaces de redes sociales tienen aria-label", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        const socialLinks = wrapper.findAll(".social-link");
        socialLinks.forEach(link => {
            expect(link.attributes("aria-label")).toBeDefined();
        });
    });

    it("Contiene RouterLinks para navegación", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        const routerLinks = wrapper.findAllComponents({ name: "RouterLink" });
        expect(routerLinks.length).toBeGreaterThan(0);
    });

    it("El enlace de Inicio apunta a /", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        const links = wrapper.findAllComponents({ name: "RouterLink" });
        const homeLink = links.find(link => link.props("to") === "/");

        expect(homeLink).toBeDefined();
        expect(homeLink?.props("to")).toBe("/");
    });

    it("El enlace de Acerca de apunta a /acerca-de", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        const links = wrapper.findAllComponents({ name: "RouterLink" });
        const aboutLink = links.find(link => link.props("to") === "/acerca-de");

        expect(aboutLink).toBeDefined();
        expect(aboutLink?.props("to")).toBe("/acerca-de");
    });

    it("El enlace de Contacto apunta a /contacto", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        const links = wrapper.findAllComponents({ name: "RouterLink" });
        const contactLink = links.find(link => link.props("to") === "/contacto");

        expect(contactLink).toBeDefined();
        expect(contactLink?.props("to")).toBe("/contacto");
    });

    it("El enlace de Privacidad apunta a /privacidad", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        const links = wrapper.findAllComponents({ name: "RouterLink" });
        const privacyLink = links.find(link => link.props("to") === "/privacidad");

        expect(privacyLink).toBeDefined();
        expect(privacyLink?.props("to")).toBe("/privacidad");
    });

    it("El enlace de Términos apunta a /terminos", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        const links = wrapper.findAllComponents({ name: "RouterLink" });
        const termsLink = links.find(link => link.props("to") === "/terminos");

        expect(termsLink).toBeDefined();
        expect(termsLink?.props("to")).toBe("/terminos");
    });

    it("Muestra el mensaje en el footer bottom", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.text()).toContain("Hecho con");
        expect(wrapper.text()).toContain("para ayudarte a manejar tus finanzas");
        expect(wrapper.find(".footer-bottom").exists()).toBe(true);
    });

    it("Los enlaces tienen la clase footer-link", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        const footerLinks = wrapper.findAll(".footer-link");
        expect(footerLinks.length).toBeGreaterThan(0);
    });
});
