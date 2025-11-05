import { describe, it, expect } from 'vitest'
import { calcularBalance } from '' // Ruta de la funcion a testear

describe("Registro de ingreso/egreso", () => {

  it("calcula balance correctamente", () => {
    const transacciones = [
      { tipo: "ingreso", monto: 100 },
      { tipo: "egreso",  monto: 40 }
    ]
    expect(calcularBalance(transacciones)).toBe(60)
  })

  it("no permite montos negativos", () => {
    const transacciones = [
      { tipo: "ingreso", monto: -10 }
    ]
    expect(() => calcularBalance(transacciones)).toThrow()
  })

})
