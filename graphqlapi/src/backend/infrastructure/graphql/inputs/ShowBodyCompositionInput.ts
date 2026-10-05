import { InputType, Field, Int } from "type-graphql";

@InputType()
export class ShowBodyCompositionInput {
  @Field(() => ID)
  id!: string;
}
