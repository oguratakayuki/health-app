import { DailyNutrientTarget } from "../entities/valueObjects/DailyNutrientTarget";
import { Gender } from "@/backend/domain/types/Gender";

export interface INutritionTargetService {
  findTargets(gender: Gender, age: number): Promise<DailyNutrientTarget[]>;
}
