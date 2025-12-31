import { UpdateNutrientInput } from "@/backend/infrastructure/graphql/inputs/prisma/UpdateNutrientInput";
import { CreateNutrientInput } from "@/backend/infrastructure/graphql/inputs/prisma/CreateNutrientInput";
import { Nutrient } from "@/backend/domain/entities/Nutrient";

export interface INutrientService {
  getNutrient(id: string): Promise<Nutrient | null>;
  getAllNutrients(): Promise<Nutrient[]>;
  createNutrient(nutrient: CreateNutrientInput): Promise<Nutrient>;
  updateNutrient(id: string, nutrient: UpdateNutrientInput): Promise<Nutrient>;
  deleteNutrient(id: string): Promise<boolean>;
  searchNutrientsByName(name: string): Promise<Nutrient[]>;
  getNutrientsByParent(parentId: string | null): Promise<Nutrient[]>;
  getNutrientsCount(): Promise<number>;
}
