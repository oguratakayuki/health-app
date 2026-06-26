import { InputType, Field } from 'type-graphql';

@InputType()
export class CreateIngredientInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  remarks?: string;

  @Field(() => String, { nullable: true })
  originalName?: string;
}
