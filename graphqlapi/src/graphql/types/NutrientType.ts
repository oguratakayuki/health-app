import { ObjectType, Field, ID, Int } from "type-graphql";

@ObjectType()
export class NutrientType {
  @Field(() => ID)
  id!: number;

  @Field(() => String, { nullable: true })
  name!: string | null;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => Int, { nullable: true })
  parentId!: number | null;
}
