import { mount } from "@vue/test-utils";
import AddTransactionForm from "../../components/AddTransactionForm.vue"; 
import { describe, expect, it } from "vitest";

describe("Formulario de ingreso/egreso", () => {
    it("muestra inputs y botón", () => {
        const wrapper = mount(AddTransactionForm);

        expect(wrapper.find("input[name='amount']").exists()).toBe(true);
        expect(wrapper.find("select[name='type']").exists()).toBe(true);
        expect(wrapper.find("button[type='submit']").text()).toContain("Agregar");
    });

    it("emite evento con datos válidos", async () => {
        const wrapper = mount(AddTransactionForm);

        await wrapper.find("select[name='type']").setValue("ingreso");
        await wrapper.find("input[name='amount']").setValue("120");
        await wrapper.find("input[name='category']").setValue("trabajo");
        await wrapper.find("form").trigger("submit");

        expect(wrapper.emitted("submit")).toBeDefined();
        expect(wrapper.emitted("submit")![0][0]).toEqual({
            type: "ingreso",
            amount: 120,
            category: "trabajo"
        });
    });
});
