import { InputType, Field, Float, Int } from "type-graphql";

@InputType()
export class UpdateNutrientsIntakeStandardInput {
  @Field(() => Int, { nullable: true })
  nutrientId?: number;

  @Field(() => Float, { nullable: true })
  content?: number;

  @Field({ nullable: true })
  unit?: string;

  @Field({ nullable: true })
  gender?: string;

  @Field(() => Int, { nullable: true })
  ageFrom?: number;

  @Field(() => Int, { nullable: true })
  ageTo?: number;
}
