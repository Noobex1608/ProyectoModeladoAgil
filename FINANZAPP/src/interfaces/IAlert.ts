import type { IPresupuesto } from "./IBudget";
import type { ICategoria } from "./ICategory";

// Severidad de alerta
export type SeveridadAlerta = "info" | "warning" | "critical";

// Interfaz que coincide con la tabla 'alerts' en Supabase
export interface IAlerta {
  id: string;
  id_usuario: string;
  id_presupuesto?: string | null;
  id_categoria?: string | null;
  mensaje: string;
  severidad: SeveridadAlerta;
  esta_leido?: boolean;
  disparado_en?: string;
  leido_en?: string | null;
}

// Interfaz extendida con información completa
export interface IAlertaConDetalles extends IAlerta {
  categoria?: ICategoria;
  presupuesto?: IPresupuesto;
}

// Filtros para alertas
export interface IFiltrosAlerta {
  esta_leido?: boolean;
  severidad?: SeveridadAlerta;
}

/**
 * @deprecated Usa SeveridadAlerta en su lugar
 */
export type AlertSeverity = SeveridadAlerta;

/**
 * @deprecated Usa IAlerta en su lugar
 */
export type IAlert = IAlerta;

/**
 * @deprecated Usa IAlertaConDetalles en su lugar
 */
export type IAlertWithDetails = IAlertaConDetalles;

/**
 * @deprecated Usa IFiltrosAlerta en su lugar
 */
export type IAlertFilters = IFiltrosAlerta;
