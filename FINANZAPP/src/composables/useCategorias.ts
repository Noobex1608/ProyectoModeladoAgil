import { computed, ref } from "vue";
import type {
  ICategoria,
  IFormularioCategoria,
  TipoCategoria,
} from "../interfaces";
import { supabase } from "../lib/conectionWithSupabase";

export function useCategorias() {
  const categorias = ref<ICategoria[]>([]);
  const cargando = ref(false);
  const error = ref<string | null>(null);

  // Categorías filtradas por tipo
  const categoriasGastos = computed(() =>
    categorias.value.filter((c) => c.tipo === "gasto")
  );

  const categoriasIngresos = computed(() =>
    categorias.value.filter((c) => c.tipo === "ingreso")
  );

  const categoriasSistema = computed(() =>
    categorias.value.filter((c) => c.es_sistema)
  );

  const categoriasPersonalizadas = computed(() =>
    categorias.value.filter((c) => !c.es_sistema)
  );

  /**
   * Mapear datos de Supabase (inglés) a interfaz español
   */
  function mapearCategoria(data: any): ICategoria {
    return {
      id: data.id,
      id_usuario: data.user_id,
      nombre: data.name,
      tipo: data.type,
      color: data.color,
      icono: data.icon,
      es_sistema: data.is_system,
      creado_en: data.created_at,
      actualizado_en: data.updated_at,
    };
  }

  /**
   * Obtener todas las categorías (sistema + personalizadas del usuario)
   */
  async function obtenerCategorias(userId?: string) {
    cargando.value = true;
    error.value = null;

    try {
      let query = supabase.from("categories").select("*");

      // Obtener categorías del sistema y del usuario
      if (userId) {
        query = query.or(`is_system.eq.true,user_id.eq.${userId}`);
      } else {
        query = query.eq("is_system", true);
      }

      const { data, error: supabaseError } = await query.order("name", {
        ascending: true,
      });

      if (supabaseError) throw supabaseError;

      categorias.value = data.map(mapearCategoria);
      return categorias.value;
    } catch (err: any) {
      error.value = err.message || "Error al obtener categorías";
      console.error("Error al obtener categorías:", err);
      return [];
    } finally {
      cargando.value = false;
    }
  }

  /**
   * Obtener categorías por tipo
   */
  async function obtenerCategoriasPorTipo(
    tipo: TipoCategoria,
    userId?: string
  ) {
    await obtenerCategorias(userId);
    return tipo === "gasto" ? categoriasGastos.value : categoriasIngresos.value;
  }

  /**
   * Crear categoría personalizada
   */
  async function crearCategoria(userId: string, datos: IFormularioCategoria) {
    cargando.value = true;
    error.value = null;

    try {
      // Mapear campos de español a inglés para Supabase
      const datosSupabase = {
        user_id: userId,
        name: datos.nombre,
        type: datos.tipo,
        color: datos.color || "#A2D3C7",
        icon: datos.icono,
        is_system: false,
      };

      const { data, error: supabaseError } = await supabase
        .from("categories")
        .insert([datosSupabase])
        .select()
        .single();

      if (supabaseError) throw supabaseError;

      const nuevaCategoria = mapearCategoria(data);
      categorias.value.push(nuevaCategoria);

      return nuevaCategoria;
    } catch (err: any) {
      error.value = err.message || "Error al crear categoría";
      console.error("Error al crear categoría:", err);
      return null;
    } finally {
      cargando.value = false;
    }
  }

  /**
   * Actualizar categoría personalizada
   */
  async function actualizarCategoria(
    categoriaId: string,
    datos: Partial<IFormularioCategoria>
  ) {
    cargando.value = true;
    error.value = null;

    try {
      // Mapear campos de español a inglés para Supabase
      const datosSupabase: any = {};
      if (datos.nombre !== undefined) datosSupabase.name = datos.nombre;
      if (datos.tipo !== undefined) datosSupabase.type = datos.tipo;
      if (datos.color !== undefined) datosSupabase.color = datos.color;
      if (datos.icono !== undefined) datosSupabase.icon = datos.icono;

      const { data, error: supabaseError } = await supabase
        .from("categories")
        .update(datosSupabase)
        .eq("id", categoriaId)
        .eq("is_system", false) // Solo actualizar categorías personalizadas
        .select()
        .single();

      if (supabaseError) throw supabaseError;

      const categoriaActualizada = mapearCategoria(data);
      const index = categorias.value.findIndex((c) => c.id === categoriaId);
      if (index !== -1) {
        categorias.value[index] = categoriaActualizada;
      }

      return categoriaActualizada;
    } catch (err: any) {
      error.value = err.message || "Error al actualizar categoría";
      console.error("Error al actualizar categoría:", err);
      return null;
    } finally {
      cargando.value = false;
    }
  }

  /**
   * Eliminar categoría personalizada
   */
  async function eliminarCategoria(categoriaId: string) {
    cargando.value = true;
    error.value = null;

    try {
      const { error: supabaseError } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoriaId)
        .eq("is_system", false); // Solo eliminar categorías personalizadas

      if (supabaseError) throw supabaseError;

      categorias.value = categorias.value.filter((c) => c.id !== categoriaId);
      return true;
    } catch (err: any) {
      error.value = err.message || "Error al eliminar categoría";
      console.error("Error al eliminar categoría:", err);
      return false;
    } finally {
      cargando.value = false;
    }
  }

  /**
   * Buscar categoría por ID
   */
  function buscarCategoria(categoriaId: string) {
    return categorias.value.find((c) => c.id === categoriaId);
  }

  return {
    // Estado
    categorias,
    cargando,
    error,

    // Computados
    categoriasGastos,
    categoriasIngresos,
    categoriasSistema,
    categoriasPersonalizadas,

    // Métodos
    obtenerCategorias,
    obtenerCategoriasPorTipo,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
    buscarCategoria,
  };
}
