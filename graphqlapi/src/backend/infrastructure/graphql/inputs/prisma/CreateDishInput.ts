import { InputType, Field } from 'type-graphql';

@InputType()
export class CreateDishInput {
  @Field()
  name!: string;
}
