// UpdateMealInput.ts (拡張版)
import { InputType, Field } from "type-graphql";
import { UpdateDishInput } from "./UpdateDishInput";

@InputType()
export class UpdateMealInput {
  @Field({ nullable: true })
  mealDate?: Date;

  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  startTime?: string;

  @Field({ nullable: true })
  endTime?: string;

  @Field({ nullable: true })
  userId?: number;

  @Field(() => [UpdateDishInput], { nullable: true })
  dishes?: UpdateDishInput[];

  @Field(() => [Number], { nullable: true })
  addDishIds?: number[]; // 新しく追加する料理のID

  @Field(() => [Number], { nullable: true })
  removeDishIds?: number[]; // 削除する料理のID
}
