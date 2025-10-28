import type { Category } from "./ICategory";

export interface Budget {
  category: Category;
  limit: number;
}
