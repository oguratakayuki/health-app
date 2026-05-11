import { NutrientCode } from "@/backend/domain/types/NutrientCode";

export class NutrientComparison {
  constructor(
    public readonly nutrientCode: NutrientCode,
    public readonly intake: number | null,
    public readonly target: number | null,
    public readonly percentage: number | null,
  ) {}
}
