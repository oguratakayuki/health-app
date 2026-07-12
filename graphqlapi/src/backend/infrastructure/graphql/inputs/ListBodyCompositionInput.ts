import { InputType, Field, Int } from "type-graphql";

@InputType()
export class ListBodyCompositionInput {
  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;
}
