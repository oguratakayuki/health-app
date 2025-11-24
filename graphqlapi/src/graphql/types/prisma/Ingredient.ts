import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class IngredientType {
  @Field(() => ID)
  id!: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  remarks?: string;

  @Field({ nullable: true })
  originalName?: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
