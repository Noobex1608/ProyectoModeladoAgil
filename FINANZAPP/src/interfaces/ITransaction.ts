import type { ICategoria } from "./ICategory";

export type TipoTransaccion = "ingreso" | "gasto";

// Interfaz que coincide con la tabla 'transactions' en Supabase
export interface ITransaccion {
  id: string;
  id_usuario: string;
  id_categoria?: string | null;
  tipo: TipoTransaccion;
  monto: number;
  descripcion?: string | null;
  fecha_transaccion: string;
  creado_en?: string;
  actualizado_en?: string;
}

// Interfaz extendida con información de categoría
export interface ITransaccionConCategoria extends ITransaccion {
  categoria?: ICategoria;
}

// Formulario para crear una nueva transacción
export interface IFormularioTransaccion {
  tipo: TipoTransaccion;
  monto: number;
  id_categoria: string;
  descripcion?: string;
  fecha_transaccion: string;
}

// Filtros para transacciones
export interface IFiltrosTransaccion {
  tipo?: TipoTransaccion | "todos";
  id_categoria?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  monto_minimo?: number;
  monto_maximo?: number;
}

/** @deprecated Use TipoTransaccion instead */
export type TransactionType = TipoTransaccion;
/** @deprecated Use ITransaccion instead */
export type ITransaction = ITransaccion;
/** @deprecated Use ITransaccionConCategoria instead */
export type ITransactionWithCategory = ITransaccionConCategoria;
/** @deprecated Use IFormularioTransaccion instead */
export type ITransactionForm = IFormularioTransaccion;
/** @deprecated Use IFiltrosTransaccion instead */
export type ITransactionFilters = IFiltrosTransaccion;
