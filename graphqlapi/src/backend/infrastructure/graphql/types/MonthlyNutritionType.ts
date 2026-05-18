import { Field, ObjectType } from "type-graphql";

import { DailyNutritionSnapshotType } from "./DailyNutritionSnapshotType";

@ObjectType()
export class MonthlyNutritionType {
  @Field(() => [DailyNutritionSnapshotType])
  days!: DailyNutritionSnapshotType[];
}
