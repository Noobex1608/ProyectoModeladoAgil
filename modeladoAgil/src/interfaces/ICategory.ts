export type Category =
  | "alimentacion"
  | "transporte"
  | "educacion"
  | "entretenimiento"
  | "otros";

export const CATEGORIES: { value: Category; label: string; icon: string }[] = [
  { value: "alimentacion", label: "Alimentación", icon: "🍔" },
  { value: "transporte", label: "Transporte", icon: "🚗" },
  { value: "educacion", label: "Educación", icon: "📚" },
  { value: "entretenimiento", label: "Entretenimiento", icon: "🎮" },
  { value: "otros", label: "Otros", icon: "📦" },
];
