import { InputType, Field } from "type-graphql";

@InputType()
export class UpdateIngredientInput {
  @Field(() => String, { nullable: false })
  name!: string;

  @Field(() => String, { nullable: true })
  remarks?: string;

  @Field(() => String, { nullable: true })
  originalName?: string;
}
