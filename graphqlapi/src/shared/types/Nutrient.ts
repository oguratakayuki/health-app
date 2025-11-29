// src/shared/types/Nutrient.ts
export interface Nutrient {
  id: string;
  name: string | null;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNutrientInput {
  name: string;
  parentId?: string | null;
}

export interface UpdateNutrientInput {
  name?: string;
  parentId?: string | null;
}
