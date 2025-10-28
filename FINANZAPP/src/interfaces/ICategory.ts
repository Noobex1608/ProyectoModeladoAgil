export type Category =
  | "alimentacion"
  | "transporte"
  | "educacion"
  | "entretenimiento"
  | "otros";

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: "alimentacion", label: "Alimentación"},
  { value: "transporte", label: "Transporte"},
  { value: "educacion", label: "Educación" },
  { value: "entretenimiento", label: "Entretenimiento"},
  { value: "otros", label: "Otros"},
];
