// Interfaz que coincide con la tabla 'categories' en Supabase
export interface ICategoria {
  id: string;
  id_usuario?: string | null;
  nombre: string;
  tipo: "ingreso" | "gasto";
  color?: string;
  icono?: string | null;
  es_sistema?: boolean;
  creado_en?: string;
  actualizado_en?: string;
}

// Formulario para crear una nueva categoría personalizada
export interface IFormularioCategoria {
  nombre: string;
  tipo: "ingreso" | "gasto";
  color?: string;
  icono?: string;
}

// Tipo para el tipo de categoría
export type TipoCategoria = "ingreso" | "gasto";

// Mantener compatibilidad con nombres en inglés (deprecated)
/** @deprecated Use ICategoria instead */
export type ICategory = ICategoria;
/** @deprecated Use IFormularioCategoria instead */
export type ICategoryForm = IFormularioCategoria;
/** @deprecated Use TipoCategoria instead */
export type CategoryType = TipoCategoria;

// Categorías predefinidas del sistema (referencia)
export const CATEGORIAS_GASTOS_SISTEMA = [
  "Alimentación",
  "Transporte",
  "Educación",
  "Entretenimiento",
  "Salud",
  "Vivienda",
  "Servicios",
  "Ropa",
  "Otros Gastos",
] as const;

export const CATEGORIAS_INGRESOS_SISTEMA = [
  "Salario",
  "Mesada",
  "Beca",
  "Freelance",
  "Venta",
  "Regalo",
  "Otros Ingresos",
] as const;

/** @deprecated Use CATEGORIAS_GASTOS_SISTEMA instead */
export const SYSTEM_EXPENSE_CATEGORIES = CATEGORIAS_GASTOS_SISTEMA;
/** @deprecated Use CATEGORIAS_INGRESOS_SISTEMA instead */
export const SYSTEM_INCOME_CATEGORIES = CATEGORIAS_INGRESOS_SISTEMA;
