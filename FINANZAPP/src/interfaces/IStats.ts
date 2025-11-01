// Vista: Balance actual del usuario (user_balance)
export interface IBalanceUsuario {
  id_usuario?: string; // user_id en BD
  total_ingresos: number; // total_ingresos en BD
  total_gastos: number; // total_gastos en BD
  balance: number; // balance en BD
}

// Respuesta de get_user_balance()
export interface IRespuestaBalance {
  total_ingresos: number;
  total_gastos: number;
  balance: number;
}

// Vista: monthly_expenses_by_category
export interface IGastosMensualesPorCategoria {
  id_usuario: string; // user_id en BD
  id_categoria: string | null; // category_id en BD
  nombre_categoria: string | null; // category_name en BD
  color_categoria: string | null; // category_color en BD
  icono_categoria: string | null; // category_icon en BD
  mes: number; // month en BD
  anio: number; // year en BD
  conteo_transacciones: number; // transaction_count en BD
  monto_total: number; // total_amount en BD
}

// Respuesta de get_monthly_expenses_by_category()
export interface IRespuestaGastosMensuales {
  id_categoria: string; // category_id en BD
  nombre_categoria: string; // category_name en BD
  color_categoria: string; // category_color en BD
  icono_categoria: string; // category_icon en BD
  monto_total: number; // total_amount en BD
  conteo_transacciones: number; // transaction_count en BD
}

// Datos para gráfico de gastos por categoría
export interface IDatosGraficoCategoria {
  categoria: string;
  monto: number;
  color: string;
  porcentaje: number;
}

// Resumen mensual
export interface IResumenMensual {
  mes: number; // month
  anio: number; // year
  total_ingresos: number;
  total_gastos: number;
  balance: number;
  conteo_transacciones: number; // transactions_count
}

// Estadísticas generales del usuario
export interface IEstadisticasUsuario {
  balance: IBalanceUsuario;
  gastos_mes_actual: IGastosMensualesPorCategoria[]; // current_month_expenses
  conteo_alertas_no_leidas: number; // unread_alerts_count
  total_transacciones: number; // total_transactions
}

// Opciones de período
export type Periodo = "week" | "month" | "year" | "custom";

// Orden de clasificación
export type OrdenClasificacion = "asc" | "desc";

// Campos para ordenar transacciones
export type CampoOrdenTransaccion =
  | "fecha_transaccion" // transaction_date
  | "monto" // amount
  | "creado_en" // created_at
  | "id_categoria"; // category_id

// ============================================
// Aliases de compatibilidad (deprecated)
// ============================================

/**
 * @deprecated Usa IBalanceUsuario en su lugar
 */
export type IUserBalance = IBalanceUsuario;

/**
 * @deprecated Usa IRespuestaBalance en su lugar
 */
export type IBalanceResponse = IRespuestaBalance;

/**
 * @deprecated Usa IRespuestaGastosMensuales en su lugar
 */
export type IMonthlyExpensesResponse = IRespuestaGastosMensuales;

/**
 * @deprecated Usa IGastosMensualesPorCategoria en su lugar
 */
export type IMonthlyExpensesByCategory = IGastosMensualesPorCategoria;

/**
 * @deprecated Usa IDatosGraficoCategoria en su lugar
 */
export type ICategoryChartData = IDatosGraficoCategoria;

/**
 * @deprecated Usa IResumenMensual en su lugar
 */
export type IMonthlySummary = IResumenMensual;

/**
 * @deprecated Usa IEstadisticasUsuario en su lugar
 */
export type IUserStats = IEstadisticasUsuario;

/**
 * @deprecated Usa Periodo en su lugar
 */
export type Period = Periodo;

/**
 * @deprecated Usa OrdenClasificacion en su lugar
 */
export type SortOrder = OrdenClasificacion;

/**
 * @deprecated Usa CampoOrdenTransaccion en su lugar
 */
export type TransactionSortField = CampoOrdenTransaccion;
