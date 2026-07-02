import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class UserProfile {
  @Field(() => ID)
  id!: string;

  @Field({ nullable: true })
  gender?: string;

  @Field()
  height!: number;

  @Field({ nullable: true })
  birthday?: Date;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
