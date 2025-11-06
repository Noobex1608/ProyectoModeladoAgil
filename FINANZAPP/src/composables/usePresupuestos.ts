import { computed, ref } from "vue";
import type {
  IFormularioPresupuesto,
  IPresupuestoConCategoria,
  IPresupuestoVsReal,
} from "../interfaces";
import { supabase } from "../lib/conectionWithSupabase";

export function usePresupuestos() {
  const presupuestos = ref<IPresupuestoConCategoria[]>([]);
  const presupuestosVsReal = ref<IPresupuestoVsReal[]>([]);
  const cargando = ref(false);
  const error = ref<string | null>(null);

  // Presupuestos excedidos (>= 100%)
  const presupuestosExcedidos = computed(() =>
    presupuestosVsReal.value.filter((p) => p.porcentaje_usado >= 100)
  );

  // Presupuestos en riesgo (>= 80% y < 100%)
  const presupuestosEnRiesgo = computed(() =>
    presupuestosVsReal.value.filter(
      (p) => p.porcentaje_usado >= 80 && p.porcentaje_usado < 100
    )
  );

  // Presupuestos saludables (< 80%)
  const presupuestosSaludables = computed(() =>
    presupuestosVsReal.value.filter((p) => p.porcentaje_usado < 80)
  );

  /**
   * Mapear datos de Supabase (inglés) a interfaz español
   */
  function mapearPresupuesto(data: any): IPresupuestoConCategoria {
    return {
      id: data.id,
      id_usuario: data.user_id,
      id_categoria: data.category_id,
      monto: parseFloat(data.amount),
      mes: data.month,
      anio: data.year,
      umbral_alerta: data.alert_threshold,
      creado_en: data.created_at,
      actualizado_en: data.updated_at,
      // Si viene la relación con categoría
      categoria: data.categories
        ? {
            id: data.categories.id,
            id_usuario: data.categories.user_id,
            nombre: data.categories.name,
            tipo: data.categories.type,
            color: data.categories.color,
            icono: data.categories.icon,
            es_sistema: data.categories.is_system,
            creado_en: data.categories.created_at,
            actualizado_en: data.categories.updated_at,
          }
        : undefined,
    };
  }

  /**
   * Mapear vista budget_vs_actual a interfaz español
   */
  function mapearPresupuestoVsReal(data: any): IPresupuestoVsReal {
    return {
      id_usuario: data.user_id,
      id_presupuesto: data.budget_id,
      id_categoria: data.category_id,
      nombre_categoria: data.category_name,
      mes: data.month,
      anio: data.year,
      monto_presupuestado: parseFloat(data.budgeted_amount),
      gasto_real: parseFloat(data.actual_spent),
      restante: parseFloat(data.remaining),
      porcentaje_usado: parseFloat(data.percentage_used),
    };
  }

  /**
   * Obtener presupuestos del usuario
   */
  async function obtenerPresupuestos(
    userId: string,
    mes?: number,
    anio?: number
  ) {
    cargando.value = true;
    error.value = null;

    try {
      let query = supabase
        .from("budgets")
        .select("*, categories(*)")
        .eq("user_id", userId);

      if (mes !== undefined) {
        query = query.eq("month", mes);
      }
      if (anio !== undefined) {
        query = query.eq("year", anio);
      }

      const { data, error: supabaseError } = await query.order("month", {
        ascending: false,
      });

      if (supabaseError) throw supabaseError;

      presupuestos.value = data.map(mapearPresupuesto);
      return presupuestos.value;
    } catch (err: any) {
      error.value = err.message || "Error al obtener presupuestos";
      console.error("Error al obtener presupuestos:", err);
      return [];
    } finally {
      cargando.value = false;
    }
  }

  /**
   * Obtener presupuestos del mes actual
   */
  async function obtenerPresupuestosMesActual(userId: string) {
    const ahora = new Date();
    return obtenerPresupuestos(
      userId,
      ahora.getMonth() + 1,
      ahora.getFullYear()
    );
  }

  /**
   * Obtener comparación presupuesto vs gasto real
   */
  async function obtenerPresupuestosVsReal(
    userId: string,
    mes?: number,
    anio?: number
  ) {
    cargando.value = true;
    error.value = null;

    try {
      let query = supabase
        .from("budget_vs_actual")
        .select("*")
        .eq("user_id", userId);

      if (mes !== undefined) {
        query = query.eq("month", mes);
      }
      if (anio !== undefined) {
        query = query.eq("year", anio);
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) throw supabaseError;

      presupuestosVsReal.value = data.map(mapearPresupuestoVsReal);
      return presupuestosVsReal.value;
    } catch (err: any) {
      error.value =
        err.message || "Error al obtener comparación de presupuestos";
      console.error("Error al obtener presupuestos vs real:", err);
      return [];
    } finally {
      cargando.value = false;
    }
  }

  /**
   * Crear nuevo presupuesto
   */
  async function crearPresupuesto(
    userId: string,
    datos: IFormularioPresupuesto
  ) {
    cargando.value = true;
    error.value = null;

    try {
      // Mapear campos de español a inglés para Supabase
      const datosSupabase = {
        user_id: userId,
        category_id: datos.id_categoria,
        amount: datos.monto,
        month: datos.mes,
        year: datos.anio,
        alert_threshold: datos.umbral_alerta || 80,
      };

      const { data, error: supabaseError } = await supabase
        .from("budgets")
        .insert([datosSupabase])
        .select("*, categories(*)")
        .single();

      if (supabaseError) throw supabaseError;

      const nuevoPresupuesto = mapearPresupuesto(data);
      presupuestos.value.push(nuevoPresupuesto);

      return nuevoPresupuesto;
    } catch (err: any) {
      error.value = err.message || "Error al crear presupuesto";
      console.error("Error al crear presupuesto:", err);
      return null;
    } finally {
      cargando.value = false;
    }
  }

  /**
   * Actualizar presupuesto existente
   */
  async function actualizarPresupuesto(
    presupuestoId: string,
    datos: Partial<IFormularioPresupuesto>
  ) {
    cargando.value = true;
    error.value = null;

    try {
      // Mapear campos de español a inglés para Supabase
      const datosSupabase: any = {};
      if (datos.id_categoria !== undefined)
        datosSupabase.category_id = datos.id_categoria;
      if (datos.monto !== undefined) datosSupabase.amount = datos.monto;
      if (datos.mes !== undefined) datosSupabase.month = datos.mes;
      if (datos.anio !== undefined) datosSupabase.year = datos.anio;
      if (datos.umbral_alerta !== undefined)
        datosSupabase.alert_threshold = datos.umbral_alerta;

      const { data, error: supabaseError } = await supabase
        .from("budgets")
        .update(datosSupabase)
        .eq("id", presupuestoId)
        .select("*, categories(*)")
        .single();

      if (supabaseError) throw supabaseError;

      const presupuestoActualizado = mapearPresupuesto(data);
      const index = presupuestos.value.findIndex((p) => p.id === presupuestoId);
      if (index !== -1) {
        presupuestos.value[index] = presupuestoActualizado;
      }

      return presupuestoActualizado;
    } catch (err: any) {
      error.value = err.message || "Error al actualizar presupuesto";
      console.error("Error al actualizar presupuesto:", err);
      return null;
    } finally {
      cargando.value = false;
    }
  }

  /**
   * Eliminar presupuesto
   */
  async function eliminarPresupuesto(presupuestoId: string) {
    cargando.value = true;
    error.value = null;

    try {
      const { error: supabaseError } = await supabase
        .from("budgets")
        .delete()
        .eq("id", presupuestoId);

      if (supabaseError) throw supabaseError;

      presupuestos.value = presupuestos.value.filter(
        (p) => p.id !== presupuestoId
      );
      return true;
    } catch (err: any) {
      error.value = err.message || "Error al eliminar presupuesto";
      console.error("Error al eliminar presupuesto:", err);
      return false;
    } finally {
      cargando.value = false;
    }
  }

  return {
    // Estado
    presupuestos,
    presupuestosVsReal,
    cargando,
    error,

    // Computados
    presupuestosExcedidos,
    presupuestosEnRiesgo,
    presupuestosSaludables,

    // Métodos
    obtenerPresupuestos,
    obtenerPresupuestosMesActual,
    obtenerPresupuestosVsReal,
    crearPresupuesto,
    actualizarPresupuesto,
    eliminarPresupuesto,
  };
}
