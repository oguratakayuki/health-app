// src/graphql/types/prisma/Nutrient.ts
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class PrismaNutrient {
  @Field(() => ID)
  id!: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => ID, { nullable: true })
  parentId?: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
