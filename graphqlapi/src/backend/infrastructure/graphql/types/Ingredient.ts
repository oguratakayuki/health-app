import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class Ingredient {
  @Field(() => ID)
  id!: string;

  @Field(() => String, { nullable: true })
  name!: string;

  @Field(() => String, { nullable: true })
  remarks?: string;

  @Field(() => String, { nullable: true })
  originalName?: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}
