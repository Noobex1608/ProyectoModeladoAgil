import { computed, ref } from "vue";
import type {
  IFiltrosTransaccion,
  IFormularioTransaccion,
  ITransaccionConCategoria,
  TipoTransaccion,
} from "../interfaces";
import { supabase } from "../lib/conectionWithSupabase";

export function useTransacciones() {
  const transacciones = ref<ITransaccionConCategoria[]>([]);
  const cargando = ref(false);
  const error = ref<string | null>(null);

  // Transacciones filtradas por tipo
  const ingresos = computed(() =>
    transacciones.value.filter((t) => t.tipo === "ingreso")
  );

  const gastos = computed(() =>
    transacciones.value.filter((t) => t.tipo === "gasto")
  );

  // Totales
  const totalIngresos = computed(() =>
    ingresos.value.reduce((sum, t) => sum + t.monto, 0)
  );

  const totalGastos = computed(() =>
    gastos.value.reduce((sum, t) => sum + t.monto, 0)
  );

  const balance = computed(() => totalIngresos.value - totalGastos.value);

  /**
   * Mapear datos de Supabase (inglés) a interfaz español
   */
  function mapearTransaccion(data: any): ITransaccionConCategoria {
    return {
      id: data.id,
      id_usuario: data.user_id,
      id_categoria: data.category_id,
      tipo: data.type,
      monto: parseFloat(data.amount),
      descripcion: data.description,
      fecha_transaccion: data.transaction_date,
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
   * Obtener todas las transacciones del usuario
   */
  async function obtenerTransacciones(
    userId: string,
    filtros?: IFiltrosTransaccion
  ) {
    cargando.value = true;
    error.value = null;

    try {
      let query = supabase
        .from("transactions")
        .select("*, categories(*)")
        .eq("user_id", userId);

      // Aplicar filtros
      if (filtros) {
        if (filtros.tipo && filtros.tipo !== "todos") {
          query = query.eq("type", filtros.tipo);
        }
        if (filtros.id_categoria) {
          query = query.eq("category_id", filtros.id_categoria);
        }
        if (filtros.fecha_inicio) {
          query = query.gte("transaction_date", filtros.fecha_inicio);
        }
        if (filtros.fecha_fin) {
          query = query.lte("transaction_date", filtros.fecha_fin);
        }
        if (filtros.monto_minimo !== undefined) {
          query = query.gte("amount", filtros.monto_minimo);
        }
        if (filtros.monto_maximo !== undefined) {
          query = query.lte("amount", filtros.monto_maximo);
        }
      }

      const { data, error: supabaseError } = await query.order(
        "transaction_date",
        { ascending: false }
      );

      if (supabaseError) throw supabaseError;

      transacciones.value = data.map(mapearTransaccion);
      return transacciones.value;
    } catch (err: any) {
      error.value = err.message || "Error al obtener transacciones";
      console.error("Error al obtener transacciones:", err);
      return [];
    } finally {
      cargando.value = false;
    }
  }

  /**
   * Obtener transacciones del mes actual
   */
  async function obtenerTransaccionesMesActual(userId: string) {
    const ahora = new Date();
    const primerDia = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const ultimoDia = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0);

    return obtenerTransacciones(userId, {
      fecha_inicio: primerDia.toISOString().split("T")[0],
      fecha_fin: ultimoDia.toISOString().split("T")[0],
    });
  }

  /**
   * Obtener transacciones por tipo
   */
  async function obtenerTransaccionesPorTipo(
    userId: string,
    tipo: TipoTransaccion
  ) {
    return obtenerTransacciones(userId, { tipo });
  }

  /**
   * Crear nueva transacción
   */
  async function crearTransaccion(
    userId: string,
    datos: IFormularioTransaccion
  ) {
    cargando.value = true;
    error.value = null;

    try {
      // Mapear campos de español a inglés para Supabase
      const datosSupabase = {
        user_id: userId,
        category_id: datos.id_categoria,
        type: datos.tipo,
        amount: datos.monto,
        description: datos.descripcion,
        transaction_date: datos.fecha_transaccion,
      };

      const { data, error: supabaseError } = await supabase
        .from("transactions")
        .insert([datosSupabase])
        .select("*, categories(*)")
        .single();

      if (supabaseError) throw supabaseError;

      const nuevaTransaccion = mapearTransaccion(data);
      transacciones.value.unshift(nuevaTransaccion);

      return nuevaTransaccion;
    } catch (err: any) {
      error.value = err.message || "Error al crear transacción";
      console.error("Error al crear transacción:", err);
      return null;
    } finally {
      cargando.value = false;
    }
  }

  /**
   * Actualizar transacción existente
   */
  async function actualizarTransaccion(
    transaccionId: string,
    datos: Partial<IFormularioTransaccion>
  ) {
    cargando.value = true;
    error.value = null;

    try {
      // Mapear campos de español a inglés para Supabase
      const datosSupabase: any = {};
      if (datos.id_categoria !== undefined)
        datosSupabase.category_id = datos.id_categoria;
      if (datos.tipo !== undefined) datosSupabase.type = datos.tipo;
      if (datos.monto !== undefined) datosSupabase.amount = datos.monto;
      if (datos.descripcion !== undefined)
        datosSupabase.description = datos.descripcion;
      if (datos.fecha_transaccion !== undefined)
        datosSupabase.transaction_date = datos.fecha_transaccion;

      const { data, error: supabaseError } = await supabase
        .from("transactions")
        .update(datosSupabase)
        .eq("id", transaccionId)
        .select("*, categories(*)")
        .single();

      if (supabaseError) throw supabaseError;

      const transaccionActualizada = mapearTransaccion(data);
      const index = transacciones.value.findIndex(
        (t) => t.id === transaccionId
      );
      if (index !== -1) {
        transacciones.value[index] = transaccionActualizada;
      }

      return transaccionActualizada;
    } catch (err: any) {
      error.value = err.message || "Error al actualizar transacción";
      console.error("Error al actualizar transacción:", err);
      return null;
    } finally {
      cargando.value = false;
    }
  }

  /**
   * Eliminar transacción
   */
  async function eliminarTransaccion(transaccionId: string) {
    cargando.value = true;
    error.value = null;

    try {
      const { error: supabaseError } = await supabase
        .from("transactions")
        .delete()
        .eq("id", transaccionId);

      if (supabaseError) throw supabaseError;

      transacciones.value = transacciones.value.filter(
        (t) => t.id !== transaccionId
      );
      return true;
    } catch (err: any) {
      error.value = err.message || "Error al eliminar transacción";
      console.error("Error al eliminar transacción:", err);
      return false;
    } finally {
      cargando.value = false;
    }
  }

  return {
    // Estado
    transacciones,
    cargando,
    error,

    // Computados
    ingresos,
    gastos,
    totalIngresos,
    totalGastos,
    balance,

    // Métodos
    obtenerTransacciones,
    obtenerTransaccionesMesActual,
    obtenerTransaccionesPorTipo,
    crearTransaccion,
    actualizarTransaccion,
    eliminarTransaccion,
  };
}
