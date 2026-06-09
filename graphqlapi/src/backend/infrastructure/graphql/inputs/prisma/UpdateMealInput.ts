// UpdateMealInput.ts (拡張版)
import { InputType, Field } from "type-graphql";
import { UpdateDishInput } from "./UpdateDishInput";

@InputType()
export class UpdateMealInput {
  @Field({ nullable: false })
  mealDate!: Date;

  @Field({ nullable: false })
  category!: string;

  @Field({ nullable: false })
  startTime!: string;

  @Field({ nullable: false })
  endTime!: string;

  @Field(() => [UpdateDishInput], { nullable: true })
  dishes?: UpdateDishInput[];

  @Field(() => [Number], { nullable: true })
  addDishIds?: number[]; // 新しく追加する料理のID

  @Field(() => [Number], { nullable: true })
  removeDishIds?: number[]; // 削除する料理のID
}
