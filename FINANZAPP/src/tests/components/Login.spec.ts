import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { createRouter, createMemoryHistory } from "vue-router";
import { supabase } from "../../lib/conectionWithSupabase";
import Login from "../../components/Login.vue";
import Register from "../../components/Register.vue";

// Mock de Supabase
vi.mock("../../lib/conectionWithSupabase", () => ({
    supabase: {
        auth: {
            signInWithPassword: vi.fn(),
        },
    },
}));

describe("Login.vue", () => {
    let router: any;

    beforeEach(() => {
        // Crear un router mock para las pruebas
        router = createRouter({
            history: createMemoryHistory(),
            routes: [
                { path: "/", component: { template: "<div>Home</div>" } },
                { path: "/register", component: Register },
                { path: "/forgot-password", component: { template: "<div>Forgot Password</div>" } },
            ],
        });

        // Limpiar localStorage y sessionStorage antes de cada test
        localStorage.clear();
        sessionStorage.clear();

        // Limpiar todos los mocks
        vi.clearAllMocks();
    });

    it("Hace login correctamente con credenciales válidas", async () => {
        // Mock de la respuesta de Supabase
        (supabase.auth.signInWithPassword as any).mockResolvedValue({
            data: { user: { email: "e1315844983@live.uleam.edu.ec" } },
            error: null,
        });

        const wrapper = mount(Login, {
            global: {
                plugins: [router],
            },
        });

        // Llenar el formulario
        await wrapper.find('[data-testid="email"]').setValue("e1315844983@live.uleam.edu.ec");
        await wrapper.find('[data-testid="password"]').setValue("David132#");

        // Enviar el formulario
        await wrapper.find('[data-testid="btn-login"]').trigger("submit.prevent");

        await wrapper.vm.$nextTick();

        // Verificar que se llamó al método de login con los datos correctos
        expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
            email: "e1315844983@live.uleam.edu.ec",
            password: "David132#",
        });
    });

    it("Muestra un formulario de inicio de sesión con todos los campos", () => {
        const wrapper = mount(Login, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.find("form").exists()).toBe(true);
        expect(wrapper.find('input[type="email"]').exists()).toBe(true);
        expect(wrapper.find('input[type="password"]').exists()).toBe(true);
        expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true);
        expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
    });

    // Comprueba que el input cambia cuando escribe el usuario
    it("Actualiza los valores del modelo cuando el usuario escribe", async () => {
        const wrapper = mount(Login, {
            global: {
                plugins: [router],
            },
        });

        const emailInput = wrapper.find('input[type="email"]');
        const passwordInput = wrapper.find('input[type="password"]');

        await emailInput.setValue("e1315844983@live.uleam.edu.ec");
        await passwordInput.setValue("David132#");

        expect((emailInput.element as HTMLInputElement).value).toBe("e1315844983@live.uleam.edu.ec");
        expect((passwordInput.element as HTMLInputElement).value).toBe("David132#");
    });

    it("Muestra error cuando el dominio del email no es válido", async () => {
        const wrapper = mount(Login, {
            global: {
                plugins: [router],
            },
        });

        await wrapper.find('input[type="email"]').setValue("test@gmail.com");
        await wrapper.find('input[type="password"]').setValue("password123");
        await wrapper.find("form").trigger("submit.prevent");

        await wrapper.vm.$nextTick();

        // Verificar que aparece el mensaje de error
        expect(wrapper.text()).toContain("@live.uleam.edu.ec");
    });

    it("Alterna la visibilidad de la contraseña al hacer clic en el botón", async () => {
        const wrapper = mount(Login, {
            global: {
                plugins: [router],
            },
        });

        const passwordInput = wrapper.find('input[id="password"]');
        const toggleButton = wrapper.find(".password-toggle");

        // Inicialmente debe ser tipo password
        expect(passwordInput.attributes("type")).toBe("password");

        // Hacer clic en el botón de toggle
        await toggleButton.trigger("click");

        // Ahora debe ser tipo text
        expect(passwordInput.attributes("type")).toBe("text");

        // Hacer clic de nuevo
        await toggleButton.trigger("click");

        // Debe volver a ser password
        expect(passwordInput.attributes("type")).toBe("password");
    });

    it("Guarda el checkbox de 'Recordarme'", async () => {
        const wrapper = mount(Login, {
            global: {
                plugins: [router],
            },
        });

        const checkbox = wrapper.find('input[type="checkbox"]');

        // Inicialmente no debería estar marcado
        expect((checkbox.element as HTMLInputElement).checked).toBe(false);

        // Marcar el checkbox
        await checkbox.setValue(true);

        expect((checkbox.element as HTMLInputElement).checked).toBe(true);
    });

    it("Contiene un enlace para registrarse", () => {
        const wrapper = mount(Login, {
            global: { plugins: [router] },
        });

        // Buscar todos los RouterLink y filtrar por el que va a /register
        const links = wrapper.findAllComponents({ name: "RouterLink" });
        const registerLink = links.find(link => link.props("to") === "/register");

        expect(registerLink).toBeDefined();
        expect(registerLink?.props("to")).toBe("/register");
        expect(registerLink?.text()).toContain("Regístrate");
    });

    it("Contiene un enlace para recuperar contraseña", () => {
        const wrapper = mount(Login, {
            global: { plugins: [router] },
        });

        // Buscar el RouterLink que va a /forgot-password
        const links = wrapper.findAllComponents({ name: "RouterLink" });
        const forgotLink = links.find(link => link.props("to") === "/forgot-password");

        expect(forgotLink).toBeDefined();
        expect(forgotLink?.props("to")).toBe("/forgot-password");
        expect(forgotLink?.text()).toBe("¿Olvidaste tu contraseña?");
    });

    it("Muestra el título y eslogan de la aplicación", () => {
        const wrapper = mount(Login, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.text()).toContain("FINANZAPP");
        expect(wrapper.text()).toContain("Tu aliado financiero");
    });
});