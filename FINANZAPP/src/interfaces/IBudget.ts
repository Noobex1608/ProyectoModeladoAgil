import type { ICategoria } from "./ICategory";

// Interfaz que coincide con la tabla 'budgets' en Supabase
export interface IPresupuesto {
  id: string;
  id_usuario: string;
  id_categoria?: string | null;
  monto: number;
  mes: number;
  anio: number;
  umbral_alerta?: number;
  creado_en?: string;
  actualizado_en?: string;
}

// Interfaz extendida con información de categoría
export interface IPresupuestoConCategoria extends IPresupuesto {
  categoria?: ICategoria;
}

// Formulario para crear un nuevo presupuesto
export interface IFormularioPresupuesto {
  id_categoria: string;
  monto: number;
  mes: number;
  anio: number;
  umbral_alerta?: number;
}

// Vista: budget_vs_actual (comparación presupuesto vs gasto real)
export interface IPresupuestoVsReal {
  id_usuario: string;
  id_presupuesto: string;
  id_categoria: string | null;
  nombre_categoria: string | null;
  mes: number;
  anio: number;
  monto_presupuestado: number;
  gasto_real: number;
  restante: number;
  porcentaje_usado: number;
}

// ============================================
// Aliases de compatibilidad (deprecated)
// ============================================

/**
 * @deprecated Usa IPresupuesto en su lugar
 */
export type IBudget = IPresupuesto;

/**
 * @deprecated Usa IPresupuestoConCategoria en su lugar
 */
export type IBudgetWithCategory = IPresupuestoConCategoria;

/**
 * @deprecated Usa IFormularioPresupuesto en su lugar
 */
export type IBudgetForm = IFormularioPresupuesto;

/**
 * @deprecated Usa IPresupuestoVsReal en su lugar
 */
export type IBudgetVsActual = IPresupuestoVsReal;
