import { computed, ref } from "vue";
import type { IFormularioActualizacionPerfil, IPerfil } from "../interfaces";
import { supabase } from "../lib/conectionWithSupabase";

export function usePerfiles() {
  const perfil = ref<IPerfil | null>(null);
  const cargando = ref(false);
  const error = ref<string | null>(null);

  // Estado computado
  const nombreCompleto = computed(() => perfil.value?.nombre_completo || "");
  const iniciales = computed(() => {
    if (!perfil.value) return "";
    const nombre = perfil.value.nombre.charAt(0).toUpperCase();
    const apellido = perfil.value.apellido.charAt(0).toUpperCase();
    return `${nombre}${apellido}`;
  });

  /**
   * Mapear datos de Supabase (inglés) a interfaz español
   */
  function mapearPerfil(data: any): IPerfil {
    return {
      id: data.id,
      email: data.email,
      nombre: data.first_name,
      apellido: data.last_name,
      nombre_completo: data.full_name,
      url_avatar: data.avatar_url,
      presupuesto_mensual: data.monthly_budget,
      creado_en: data.created_at,
      actualizado_en: data.updated_at,
    };
  }

  /**
   * Obtener perfil del usuario actual
   */
  async function obtenerPerfil(userId: string) {
    cargando.value = true;
    error.value = null;

    try {
      const { data, error: supabaseError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (supabaseError) throw supabaseError;

      perfil.value = mapearPerfil(data);
      return perfil.value;
    } catch (err: any) {
      error.value = err.message || "Error al obtener el perfil";
      console.error("Error al obtener perfil:", err);
      return null;
    } finally {
      cargando.value = false;
    }
  }

  /**
   * Actualizar perfil del usuario
   */
  async function actualizarPerfil(
    userId: string,
    datos: IFormularioActualizacionPerfil
  ) {
    cargando.value = true;
    error.value = null;

    try {
      // Mapear campos de español a inglés para Supabase
      const datosSupabase: any = {};
      if (datos.nombre !== undefined) datosSupabase.first_name = datos.nombre;
      if (datos.apellido !== undefined)
        datosSupabase.last_name = datos.apellido;
      if (datos.url_avatar !== undefined)
        datosSupabase.avatar_url = datos.url_avatar;
      if (datos.presupuesto_mensual !== undefined) {
        datosSupabase.monthly_budget = datos.presupuesto_mensual;
      }

      const { data, error: supabaseError } = await supabase
        .from("profiles")
        .update(datosSupabase)
        .eq("id", userId)
        .select()
        .single();

      if (supabaseError) throw supabaseError;

      perfil.value = mapearPerfil(data);
      return perfil.value;
    } catch (err: any) {
      error.value = err.message || "Error al actualizar el perfil";
      console.error("Error al actualizar perfil:", err);
      return null;
    } finally {
      cargando.value = false;
    }
  }

  /**
   * Subir avatar del usuario
   */
  async function subirAvatar(userId: string, archivo: File) {
    cargando.value = true;
    error.value = null;

    try {
      // 1. Subir archivo a Storage
      const nombreArchivo = `${userId}-${Date.now()}.${archivo.name
        .split(".")
        .pop()}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(nombreArchivo, archivo, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // 2. Obtener URL pública
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(nombreArchivo);

      // 3. Actualizar perfil con la URL del avatar
      return await actualizarPerfil(userId, {
        url_avatar: urlData.publicUrl,
      });
    } catch (err: any) {
      error.value = err.message || "Error al subir el avatar";
      console.error("Error al subir avatar:", err);
      return null;
    } finally {
      cargando.value = false;
    }
  }

  /**
   * Eliminar avatar del usuario
   */
  async function eliminarAvatar(userId: string) {
    return await actualizarPerfil(userId, {
      url_avatar: undefined,
    });
  }

  return {
    // Estado
    perfil,
    cargando,
    error,

    // Computados
    nombreCompleto,
    iniciales,

    // Métodos
    obtenerPerfil,
    actualizarPerfil,
    subirAvatar,
    eliminarAvatar,
  };
}
