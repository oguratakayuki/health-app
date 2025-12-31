import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class User {
  @Field(() => ID)
  id!: string;

  @Field(() => String, { nullable: false })
  email!: string;

  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field(() => String, { nullable: true })
  cognitoSub?: string | null;

  @Field(() => Boolean, { nullable: false, defaultValue: false })
  isAdmin!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
