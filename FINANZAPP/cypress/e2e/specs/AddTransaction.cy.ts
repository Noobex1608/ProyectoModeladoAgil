/// <reference types="cypress" />

describe("Ingreso/Egreso UI Test", () => {
  it("permite agregar un ingreso visualmente", () => {
    cy.visit("http://localhost:5173");

    cy.get("[data-testid='type']").select("ingreso");
    cy.get("[data-testid='amount']").type("100");
    cy.get("[data-testid='category']").type("trabajo");
    cy.get("[data-testid='submit']").click();

    cy.contains("Ingreso: $100").should("be.visible");
  });

  it("no permite enviar formulario vacío", () => {
    cy.visit("/");
    cy.get("[data-testid='submit']").click();
    cy.contains("Monto requerido").should("be.visible");
  });
});
