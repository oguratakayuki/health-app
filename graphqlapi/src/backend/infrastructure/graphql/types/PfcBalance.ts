import { Field, Float, ObjectType } from "type-graphql";

@ObjectType()
export class PfcBalanceType {
  @Field(() => Float, { nullable: true })
  protein!: number | null;

  @Field(() => Float, { nullable: true })
  fat!: number | null;

  @Field(() => Float, { nullable: true })
  carbohydrate!: number | null;
}
