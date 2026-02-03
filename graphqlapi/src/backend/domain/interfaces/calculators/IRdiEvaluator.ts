import { NutrientCode } from '../../types/NutrientCode';

export interface IRdiEvaluationResult {
  nutrientCode: NutrientCode;
  intake: number | null;
  rdi: number;
  ratio: number | null; // intake / rdi
}

export interface IRdiEvaluator {
  evaluate(
    userId: string,
    date: string
  ): Promise<IRdiEvaluationResult[]>;
}
