import { ObjectType, Field, ID } from "type-graphql";
import { NutrientType } from "./NutrientType";

@ObjectType()
export class IngredientType {
  @Field(() => ID)
  id!: number;

  @Field()
  name!: string;

  @Field(() => [NutrientType], { nullable: true })
  nutrients?: NutrientType[];

}

