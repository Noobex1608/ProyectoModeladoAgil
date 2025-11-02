// ===== CATEGORÍAS =====
export type {
  // Aliases deprecated
  CategoryType,
  ICategoria,
  ICategory,
  ICategoryForm,
  IFormularioCategoria,
  TipoCategoria,
} from "./ICategory";

export {
  CATEGORIAS_GASTOS_SISTEMA,
  CATEGORIAS_INGRESOS_SISTEMA,
  // Aliases deprecated
  SYSTEM_EXPENSE_CATEGORIES,
  SYSTEM_INCOME_CATEGORIES,
} from "./ICategory";

// ===== TRANSACCIONES =====
export type {
  IFiltrosTransaccion,
  IFormularioTransaccion,
  ITransaccion,
  ITransaccionConCategoria,
  ITransaction,
  ITransactionFilters,
  ITransactionForm,
  ITransactionWithCategory,
  TipoTransaccion,
  // Aliases deprecated
  TransactionType,
} from "./ITransaction";

// ===== PRESUPUESTOS =====
export type {
  // Aliases deprecated
  IBudget,
  IBudgetForm,
  IBudgetVsActual,
  IBudgetWithCategory,
  IFormularioPresupuesto,
  IPresupuesto,
  IPresupuestoConCategoria,
  IPresupuestoVsReal,
} from "./IBudget";

// ===== PERFILES =====
export type {
  IFormularioActualizacionPerfil,
  IPerfil,
  // Aliases deprecated
  IProfile,
  IProfileUpdateForm,
} from "./IProfile";

// ===== ALERTAS =====
export type {
  // Aliases deprecated
  AlertSeverity,
  IAlert,
  IAlerta,
  IAlertaConDetalles,
  IAlertFilters,
  IAlertWithDetails,
  IFiltrosAlerta,
  SeveridadAlerta,
} from "./IAlert";

// ===== ESTADÍSTICAS =====
export type {
  CampoOrdenTransaccion,
  IBalanceResponse,
  IBalanceUsuario,
  ICategoryChartData,
  IDatosGraficoCategoria,
  IEstadisticasUsuario,
  IGastosMensualesPorCategoria,
  IMonthlyExpensesByCategory,
  IMonthlyExpensesResponse,
  IMonthlySummary,
  IRespuestaBalance,
  IRespuestaGastosMensuales,
  IResumenMensual,
  // Aliases deprecated
  IUserBalance,
  IUserStats,
  OrdenClasificacion,
  Period,
  Periodo,
  SortOrder,
  TransactionSortField,
} from "./IStats";
