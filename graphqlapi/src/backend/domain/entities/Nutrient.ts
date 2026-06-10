// backend/domain/entities/Nutrient.ts

export interface Nutrient {
  id: number;
  name: string;
  code: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
export interface CreateNutrientInput {
  name: string;
  code: string;
  parentId?: string | null;
}

export interface UpdateNutrientInput {
  name?: string;
  code?: string;
  parentId?: string | null;
}
