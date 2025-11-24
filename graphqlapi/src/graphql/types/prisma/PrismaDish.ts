import { ObjectType, Field, ID } from 'type-graphql';
import { DishIngredientType } from './DishIngredient';

@ObjectType()
export class PrismaDish {
  @Field(() => ID)
  id!: string;

  @Field({ nullable: true })
  name?: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
export class PrismaDishWithIngredients extends PrismaDish {
  @Field(() => [DishIngredientType])
  dishIngredients!: DishIngredientType[];
}
