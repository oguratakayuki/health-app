import { InputType, Field } from 'type-graphql';

@InputType()
export class UpdateDishInput {
  @Field({ nullable: true })
  name?: string;
}
