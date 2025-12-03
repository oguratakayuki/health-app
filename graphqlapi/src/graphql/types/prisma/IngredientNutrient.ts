import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class IngredientNutrient {
  @Field(() => ID)
  id!: string;

  @Field(() => ID, { nullable: true })
  ingredientId?: string;

  @Field(() => ID, { nullable: true })
  nutrientId?: string;

  @Field({ nullable: true })
  contentQuantity?: number;

  @Field({ nullable: true })
  contentUnit?: string;

  @Field({ nullable: true })
  contentUnitPer?: number;

  @Field({ nullable: true })
  contentUnitPerUnit?: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
