import { DailyNutrientTarget } from "@/backend/domain/entities/valueObjects/DailyNutrientTarget";
import { Gender } from "@/backend/domain/types/Gender";
import { INutrientsIntakeStandardRepository } from "@/backend/domain/interfaces/INutrientsIntakeStandardRepository";

export class NutritionTargetService {
  constructor(
    private readonly repository: INutrientsIntakeStandardRepository,
  ) {}

  async findTargets(
    gender: Gender,
    age: number,
  ): Promise<DailyNutrientTarget[]> {
    console.log("here 1!!!!!!!!!!!!!!!1");
    const standards = await this.repository.findByGenderAndAge(gender, age);
    console.log(standards);
    console.log("here 2!!!!!!!!!!!!!!!2");

    return standards.map(
      (standard) =>
        new DailyNutrientTarget(
          standard.nutrient.code,
          standard.content,
          standard.unit,
        ),
    );
  }
}
