import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { Nutrient } from "./Nutrient";

@ObjectType()
export class NutrientsIntakeStandard {
  @Field(() => ID)
  id!: string;

  // () => Int のように明示的に指定する
  @Field(() => Int, { nullable: true })
  nutrientId?: number | null;

  @Field(() => Float, { nullable: true })
  content?: number | null;

  @Field(() => String, { nullable: true })
  unit?: string | null;

  @Field(() => String, { nullable: true })
  gender?: string | null;

  @Field(() => Int, { nullable: true })
  ageFrom?: number | null;

  @Field(() => Int, { nullable: true })
  ageTo?: number | null;

  @Field(() => Nutrient, { nullable: true })
  nutrient?: Nutrient | null;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
