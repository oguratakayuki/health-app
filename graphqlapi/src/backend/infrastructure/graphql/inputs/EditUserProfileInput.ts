import { InputType, Field, Int } from "type-graphql";

@InputType()
export class EditUserProfileInput {
  @Field(() => Int, { nullable: false })
  id!: number;

  @Field({ nullable: true })
  gender?: string;

  @Field(() => Number, { nullable: true })
  height?: number;

  @Field({ nullable: true })
  birthday?: string;
}
