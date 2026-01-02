import { InputType, Field, Float, Int } from "type-graphql";

@InputType()
export class CreateNutrientsIntakeStandardInput {
  @Field(() => Int)
  nutrientId!: number;

  @Field(() => Float)
  content!: number;

  @Field()
  unit!: string;

  @Field()
  gender!: string;

  @Field(() => Int, { nullable: true })
  ageFrom?: number;

  @Field(() => Int, { nullable: true })
  ageTo?: number;
}
