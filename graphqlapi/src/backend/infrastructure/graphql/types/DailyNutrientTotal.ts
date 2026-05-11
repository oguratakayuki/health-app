import { Field, Float, ObjectType } from "type-graphql";

@ObjectType()
export class DailyNutrientTotalType {
  @Field()
  nutrientCode!: string;

  @Field(() => Float, { nullable: true })
  value!: number | null;
}
