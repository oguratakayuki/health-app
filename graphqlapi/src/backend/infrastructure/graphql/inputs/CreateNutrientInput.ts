// src/backend/infrastructure/graphql/inputs/prisma/CreateNutrientInput.ts
import { InputType, Field } from "type-graphql";

@InputType()
export class CreateNutrientInput {
  @Field()
  name!: string;

  @Field()
  code!: string;

  @Field(() => String, { nullable: true })
  parentId?: string | null;
}
