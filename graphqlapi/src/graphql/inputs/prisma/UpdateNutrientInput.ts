// src/graphql/inputs/prisma/UpdateNutrientInput.ts
import { InputType, Field } from 'type-graphql';

@InputType()
export class UpdateNutrientInput {
  @Field({ nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  parentId?: string | null;
}
