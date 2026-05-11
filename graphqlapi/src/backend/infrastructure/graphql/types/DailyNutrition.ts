import { Field, ObjectType } from "type-graphql";

import { DailyNutrientTotalType } from "./DailyNutrientTotal";
import { PfcBalanceType } from "./PfcBalance";
import { NutrientComparisonType } from "./NutrientComparison";

@ObjectType()
export class DailyNutritionType {
  @Field(() => [DailyNutrientTotalType])
  totals!: DailyNutrientTotalType[];

  @Field(() => PfcBalanceType)
  pfc!: PfcBalanceType;

  @Field(() => [NutrientComparisonType])
  comparisons!: NutrientComparisonType[];
}
