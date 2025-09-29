
import { ObjectType, Field, ID, Int } from "type-graphql";
import { Column, Entity, Index, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Ingredient } from "./Ingredient";
import { Nutrient } from "./Nutrient";

@ObjectType()
@Entity("ingredient_nutrients", { schema: "health_development" })
export class IngredientNutrient {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id!: string;

  @Field(() => Ingredient, { nullable: true })
  @ManyToOne(() => Ingredient, ingredient => ingredient.ingredientNutrients)
  @JoinColumn({ name: "ingredient_id" })
  ingredient!: Ingredient;

  @Field(() => Nutrient, { nullable: true })
  @ManyToOne(() => Nutrient, nutrient => nutrient.ingredientNutrients)
  @JoinColumn({ name: "nutrient_id" })
  nutrient!: Nutrient;

  @Field(() => Int, { nullable: true })
  @Column("int", { name: "content_quantity", nullable: true })
  contentQuantity!: number | null;

  @Field(() => String, { nullable: true })
  @Column("varchar", { name: "content_unit", nullable: true, length: 255 })
  contentUnit!: string | null;

  @Field(() => Int, { nullable: true })
  @Column("int", { name: "content_unit_per", nullable: true })
  contentUnitPer!: number | null;

  @Field(() => String, { nullable: true })
  @Column("varchar", { name: "content_unit_per_unit", nullable: true, length: 255 })
  contentUnitPerUnit!: string | null;

  @Field()
  @Column("datetime", { name: "created_at" })
  createdAt!: Date;

  @Field()
  @Column("datetime", { name: "updated_at" })
  updatedAt!: Date;
}
