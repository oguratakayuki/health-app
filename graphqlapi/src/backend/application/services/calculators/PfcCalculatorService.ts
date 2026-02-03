import { IPfcCalculator } from "../../../domain/interfaces/calculators/IPfcCalculator";

export class PfcCalculatorService implements IPfcCalculator {
  calculate(dailyTotal: any) {
    throw new Error("Not implemented");
  }
}
