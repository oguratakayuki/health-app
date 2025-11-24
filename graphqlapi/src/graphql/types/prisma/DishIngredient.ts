import { ObjectType, Field, ID } from 'type-graphql';
import { IngredientType } from './Ingredient';

@ObjectType()
export class DishIngredientType {
  @Field(() => ID)
  id!: string;

  @Field(() => Number)
  contentQuantity!: number;

  @Field()
  contentUnit!: string;

  @Field(() => IngredientType)
  ingredient!: IngredientType;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
