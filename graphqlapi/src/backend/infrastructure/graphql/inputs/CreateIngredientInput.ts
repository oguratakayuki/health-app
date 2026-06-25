import { InputType, Field } from "type-graphql";

@InputType()
export class CreateIngredientInput {
  @Field(() => String, { nullable: false })
  name!: string;
}
