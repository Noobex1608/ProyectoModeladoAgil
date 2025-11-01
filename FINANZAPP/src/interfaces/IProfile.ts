export interface IPerfil {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  nombre_completo?: string;
  url_avatar?: string | null;
  presupuesto_mensual?: number;
  creado_en?: string;
  actualizado_en?: string;
}

// Formulario de actualización de perfil
export interface IFormularioActualizacionPerfil {
  nombre?: string;
  apellido?: string;
  url_avatar?: string;
  presupuesto_mensual?: number;
}

// Mantener compatibilidad con nombres en inglés (deprecated)
/** @deprecated Use IPerfil instead */
export type IProfile = IPerfil;
/** @deprecated Use IFormularioActualizacionPerfil instead */
export type IProfileUpdateForm = IFormularioActualizacionPerfil;
