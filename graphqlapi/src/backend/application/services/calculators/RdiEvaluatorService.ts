import { IRdiEvaluator } from "../../../domain/interfaces/calculators/IRdiEvaluator";

export class RdiEvaluatorService implements IRdiEvaluator {
  async evaluate(userId: string, date: string) {
    throw new Error("Not implemented");
  }
}
