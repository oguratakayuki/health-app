// src/graphql/inputs/prisma/UpdateNutrientInput.ts
import { InputType, Field } from "type-graphql";

@InputType()
export class UpdateNutrientInput {
  @Field({ nullable: false })
  name!: string;

  @Field({ nullable: false })
  code!: string;

  @Field(() => String, { nullable: true })
  parentId?: string | null;
}
