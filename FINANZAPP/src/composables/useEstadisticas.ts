import { computed, ref } from "vue";
import type {
  IBalanceUsuario,
  IDatosGraficoCategoria,
  IGastosMensualesPorCategoria,
  IRespuestaGastosMensuales,
} from "../interfaces";
import { supabase } from "../lib/conectionWithSupabase";

export function useEstadisticas() {
  const balance = ref<IBalanceUsuario | null>(null);
  const gastosMensuales = ref<IRespuestaGastosMensuales[]>([]);
  const cargando = ref(false);
  const error = ref<string | null>(null);

  // Datos formateados para gráficos
  const datosGraficoGastos = computed<IDatosGraficoCategoria[]>(() => {
    if (gastosMensuales.value.length === 0) return [];

    const total = gastosMensuales.value.reduce(
      (sum, g) => sum + g.monto_total,
      0
    );

    return gastosMensuales.value.map((gasto) => ({
      categoria: gasto.nombre_categoria,
      monto: gasto.monto_total,
      color: gasto.color_categoria,
      porcentaje: total > 0 ? (gasto.monto_total / total) * 100 : 0,
    }));
  });

  /**
   * Obtener balance del usuario usando la función de BD
   */
  async function obtenerBalance(userId: string) {
    cargando.value = true;
    error.value = null;

    try {
      const { data, error: supabaseError } = await supabase.rpc(
        "get_user_balance",
        { uid: userId }
      );

      if (supabaseError) throw supabaseError;

      if (data && data.length > 0) {
        const resultado = data[0];
        balance.value = {
          id_usuario: userId,
          total_ingresos: parseFloat(resultado.total_ingresos),
          total_gastos: parseFloat(resultado.total_gastos),
          balance: parseFloat(resultado.balance),
        };
      } else {
        balance.value = {
          id_usuario: userId,
          total_ingresos: 0,
          total_gastos: 0,
          balance: 0,
        };
      }

      return balance.value;
    } catch (err: any) {
      error.value = err.message || "Error al obtener balance";
      console.error("Error al obtener balance:", err);
      return null;
    } finally {
      cargando.value = false;
    }
  }

  /**
   * Obtener balance desde la vista user_balance
   */
  async function obtenerBalanceDesdeVista(userId: string) {
    cargando.value = true;
    error.value = null;

    try {
      const { data, error: supabaseError } = await supabase
        .from("user_balance")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (supabaseError) throw supabaseError;

      balance.value = {
        id_usuario: data.user_id,
        total_ingresos: parseFloat(data.total_ingresos),
        total_gastos: parseFloat(data.total_gastos),
        balance: parseFloat(data.balance),
      };

      return balance.value;
    } catch (err: any) {
      error.value = err.message || "Error al obtener balance";
      console.error("Error al obtener balance:", err);
      return null;
    } finally {
      cargando.value = false;
    }
  }

  /**
   * Obtener gastos mensuales por categoría usando función de BD
   */
  async function obtenerGastosMensualesPorCategoria(
    userId: string,
    mes?: number,
    anio?: number
  ) {
    cargando.value = true;
    error.value = null;

    try {
      const ahora = new Date();
      const mesActual = mes || ahora.getMonth() + 1;
      const anioActual = anio || ahora.getFullYear();

      const { data, error: supabaseError } = await supabase.rpc(
        "get_monthly_expenses_by_category",
        {
          uid: userId,
          target_month: mesActual,
          target_year: anioActual,
        }
      );

      if (supabaseError) throw supabaseError;

      gastosMensuales.value = (data || []).map((item: any) => ({
        id_categoria: item.category_id,
        nombre_categoria: item.category_name,
        color_categoria: item.category_color,
        icono_categoria: item.category_icon,
        monto_total: parseFloat(item.total_amount),
        conteo_transacciones: parseInt(item.transaction_count),
      }));

      return gastosMensuales.value;
    } catch (err: any) {
      error.value = err.message || "Error al obtener gastos mensuales";
      console.error("Error al obtener gastos mensuales:", err);
      return [];
    } finally {
      cargando.value = false;
    }
  }

  /**
   * Obtener gastos mensuales desde la vista
   */
  async function obtenerGastosMensualesDesdeVista(
    userId: string,
    mes?: number,
    anio?: number
  ) {
    cargando.value = true;
    error.value = null;

    try {
      const ahora = new Date();
      const mesActual = mes || ahora.getMonth() + 1;
      const anioActual = anio || ahora.getFullYear();

      let query = supabase
        .from("monthly_expenses_by_category")
        .select("*")
        .eq("user_id", userId)
        .eq("month", mesActual)
        .eq("year", anioActual)
        .order("total_amount", { ascending: false });

      const { data, error: supabaseError } = await query;

      if (supabaseError) throw supabaseError;

      const gastosVista: IGastosMensualesPorCategoria[] = (data || []).map(
        (item: any) => ({
          id_usuario: item.user_id,
          id_categoria: item.category_id,
          nombre_categoria: item.category_name,
          color_categoria: item.category_color,
          icono_categoria: item.category_icon,
          mes: item.month,
          anio: item.year,
          conteo_transacciones: item.transaction_count,
          monto_total: parseFloat(item.total_amount),
        })
      );

      // Convertir a IRespuestaGastosMensuales
      gastosMensuales.value = gastosVista.map((g) => ({
        id_categoria: g.id_categoria || "",
        nombre_categoria: g.nombre_categoria || "",
        color_categoria: g.color_categoria || "#A2D3C7",
        icono_categoria: g.icono_categoria || "📦",
        monto_total: g.monto_total,
        conteo_transacciones: g.conteo_transacciones,
      }));

      return gastosMensuales.value;
    } catch (err: any) {
      error.value = err.message || "Error al obtener gastos mensuales";
      console.error("Error al obtener gastos mensuales:", err);
      return [];
    } finally {
      cargando.value = false;
    }
  }

  /**
   * Obtener resumen completo del usuario
   */
  async function obtenerResumenCompleto(
    userId: string,
    mes?: number,
    anio?: number
  ) {
    await Promise.all([
      obtenerBalance(userId),
      obtenerGastosMensualesPorCategoria(userId, mes, anio),
    ]);

    return {
      balance: balance.value,
      gastos_mensuales: gastosMensuales.value,
      datos_grafico: datosGraficoGastos.value,
    };
  }

  /**
   * Calcular estadísticas de un período personalizado
   */
  async function obtenerEstadisticasPeriodo(
    userId: string,
    fechaInicio: string,
    fechaFin: string
  ) {
    cargando.value = true;
    error.value = null;

    try {
      // Obtener transacciones del período
      const { data, error: supabaseError } = await supabase
        .from("transactions")
        .select("*, categories(*)")
        .eq("user_id", userId)
        .gte("transaction_date", fechaInicio)
        .lte("transaction_date", fechaFin);

      if (supabaseError) throw supabaseError;

      // Calcular totales
      const totalIngresos = data
        .filter((t) => t.type === "ingreso")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const totalGastos = data
        .filter((t) => t.type === "gasto")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      // Agrupar gastos por categoría
      const gastosPorCategoria = new Map<string, any>();

      data
        .filter((t) => t.type === "gasto" && t.categories)
        .forEach((t) => {
          const catId = t.category_id;
          if (!catId) return;

          if (!gastosPorCategoria.has(catId)) {
            gastosPorCategoria.set(catId, {
              id_categoria: catId,
              nombre_categoria: t.categories.name,
              color_categoria: t.categories.color,
              icono_categoria: t.categories.icon,
              monto_total: 0,
              conteo_transacciones: 0,
            });
          }

          const categoria = gastosPorCategoria.get(catId);
          categoria.monto_total += parseFloat(t.amount);
          categoria.conteo_transacciones += 1;
        });

      return {
        total_ingresos: totalIngresos,
        total_gastos: totalGastos,
        balance: totalIngresos - totalGastos,
        gastos_por_categoria: Array.from(gastosPorCategoria.values()),
        total_transacciones: data.length,
      };
    } catch (err: any) {
      error.value = err.message || "Error al obtener estadísticas del período";
      console.error("Error al obtener estadísticas del período:", err);
      return null;
    } finally {
      cargando.value = false;
    }
  }

  return {
    // Estado
    balance,
    gastosMensuales,
    cargando,
    error,

    // Computados
    datosGraficoGastos,

    // Métodos
    obtenerBalance,
    obtenerBalanceDesdeVista,
    obtenerGastosMensualesPorCategoria,
    obtenerGastosMensualesDesdeVista,
    obtenerResumenCompleto,
    obtenerEstadisticasPeriodo,
  };
}
