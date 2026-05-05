// backend/domain/entities/Nutrient.ts

export interface Nutrient {
  id: string;
  name: string | null;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface CreateNutrientInput {
  name: string;
  code: string;
}

export interface UpdateNutrientInput {
  name?: string;
  code?: string;
}
