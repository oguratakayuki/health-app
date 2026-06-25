import { ObjectType, Field, ID, Int } from "type-graphql";

@ObjectType()
export class Nutrient {
  @Field(() => ID)
  id!: string;

  @Field(() => String, { nullable: false })
  name!: string | null;

  @Field(() => String, { nullable: false })
  code!: string | null;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => String, { nullable: true })
  parentId?: string | null;
}
