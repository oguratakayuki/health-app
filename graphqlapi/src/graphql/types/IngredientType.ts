import { ObjectType, Field, ID } from "type-graphql";
import { NutrientType } from "./NutrientType";
import { DishType } from "./DishType";

@ObjectType()
export class IngredientType {
  @Field(() => ID)
  id!: number;

  @Field()
  name!: string;

  @Field(() => [NutrientType], { nullable: true })
  nutrients?: NutrientType[];

  @Field(() => [DishType], { nullable: true })
  dishes?: DishType[];
}

