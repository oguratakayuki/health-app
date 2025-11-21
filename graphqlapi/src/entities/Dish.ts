import { ObjectType, Field, ID } from "type-graphql";
import { Ingredient } from "./Ingredient";

@ObjectType()
export class Dish {
  @Field(() => ID)
  id!: number;

  @Field(() => String, { nullable: true })
  name!: string | null;

  @Field(() => [Ingredient], { nullable: true })
  ingredients?: Ingredient[];

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

