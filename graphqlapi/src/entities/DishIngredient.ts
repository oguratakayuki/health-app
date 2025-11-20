
import { ObjectType, Field, ID, Int } from "type-graphql";
import { Column, Entity, Index, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Ingredient } from "./Ingredient";
import { Dish } from "./Dish";

@ObjectType()
@Entity("dish_ingredients", { schema: "health_development" })
export class DishIngredient {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id!: string;

  // @Field(() => Ingredient, { nullable: true })
  // @ManyToOne('Ingredient', 'dishIngredients')
  // @JoinColumn({ name: "ingredient_id" })
  // ingredient!: Ingredient;

  // @Field(() => Dish, { nullable: true })
  // @ManyToOne('Dish', 'dishIngredients')
  // @JoinColumn({ name: "dish_id" })
  // dish!: Dish;

  @Field(() => Int, { nullable: true })
  @Column("int", { name: "content_quantity", nullable: true })
  contentQuantity!: number | null;

  @Field(() => String, { nullable: true })
  @Column("varchar", { name: "content_unit", nullable: true, length: 255 })
  contentUnit!: string | null;

  @Field()
  @Column("datetime", { name: "created_at" })
  createdAt!: Date;

  @Field()
  @Column("datetime", { name: "updated_at" })
  updatedAt!: Date;
}
