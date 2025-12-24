import { InputType, Field } from 'type-graphql';

@InputType()
export class CreateIngredientInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  remarks?: string;

  @Field({ nullable: true })
  originalName?: string;
}
