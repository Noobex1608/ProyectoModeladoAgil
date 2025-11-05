import { describe, it, expect } from "vitest";

// Función de utilidad para calcular totales por categoría
export function calcCategoryTotals(items: Array<{ category: string; amount: number }>) {
  return items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {} as Record<string, number>);
}

describe("calcCategoryTotals", () => {
  it("calcula totales por categoría", () => {
    const items = [
      { category: "Comida", amount: 50 },
      { category: "Transporte", amount: 20 },
      { category: "Vivienda", amount: 100 },
      { category: "Educación", amount: 5 },
      { category: "Higiene", amount: 15 },
      { category: "Entretenimiento", amount: 15 },
    ];

    const result = calcCategoryTotals(items);

    expect(result).toEqual({
      Comida: 50,
      Transporte: 20,
      Vivienda: 100,
      Educación: 5,
      Higiene: 15,
      Entretenimiento: 15
    });
  });

  it("retorna objeto vacío cuando no hay datos", () => {
    expect(calcCategoryTotals([])).toEqual({});
  });

  it("suma correctamente múltiples items de la misma categoría", () => {
    const items = [
      { category: "Comida", amount: 50 },
      { category: "Comida", amount: 30 },
      { category: "Transporte", amount: 20 },
    ];

    const result = calcCategoryTotals(items);

    expect(result).toEqual({
      Comida: 80,
      Transporte: 20,
    });
  });
});
