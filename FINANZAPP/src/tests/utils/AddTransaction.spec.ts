import { describe, it, expect, vi, beforeEach } from "vitest";
import { useTransacciones } from "../../composables/useTransacciones";

// Mock de Supabase
vi.mock("../../lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(),
        })),
      })),
    })),
  },
}));

describe("useTransacciones - crearTransaccion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe exportar la función crearTransaccion", () => {
    const { crearTransaccion } = useTransacciones();
    expect(crearTransaccion).toBeDefined();
    expect(typeof crearTransaccion).toBe("function");
  });

  it("debe tener propiedades reactivas", () => {
    const { transacciones, cargando, error } = useTransacciones();
    
    expect(transacciones).toBeDefined();
    expect(cargando).toBeDefined();
    expect(error).toBeDefined();
  });

  it("debe tener métodos computados", () => {
    const { ingresos, gastos, totalIngresos, totalGastos, balance } = useTransacciones();
    
    expect(ingresos).toBeDefined();
    expect(gastos).toBeDefined();
    expect(totalIngresos).toBeDefined();
    expect(totalGastos).toBeDefined();
    expect(balance).toBeDefined();
  });

  it("debe exportar todos los métodos principales", () => {
    const { 
      obtenerTransacciones,
      obtenerTransaccionesMesActual,
      obtenerTransaccionesPorTipo,
      crearTransaccion,
      actualizarTransaccion,
      eliminarTransaccion
    } = useTransacciones();
    
    expect(obtenerTransacciones).toBeDefined();
    expect(obtenerTransaccionesMesActual).toBeDefined();
    expect(obtenerTransaccionesPorTipo).toBeDefined();
    expect(crearTransaccion).toBeDefined();
    expect(actualizarTransaccion).toBeDefined();
    expect(eliminarTransaccion).toBeDefined();
  });
});
