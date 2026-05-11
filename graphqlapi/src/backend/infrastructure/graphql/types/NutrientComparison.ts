import { Field, Float, ObjectType } from "type-graphql";

@ObjectType()
export class NutrientComparisonType {
  @Field()
  nutrientCode!: string;

  @Field(() => Float, { nullable: true })
  intake!: number | null;

  @Field(() => Float, { nullable: true })
  target!: number | null;

  @Field(() => Float, { nullable: true })
  percentage!: number | null;
}
