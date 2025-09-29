import { ObjectType, Field, ID, Int } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany } from "typeorm";
import { Ingredient } from "./Ingredient";
import { IngredientNutrient } from "./IngredientNutrient";

@ObjectType()
@Entity("nutrients", { schema: "health_development" })
export class Nutrient {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id!: string;

  @Field(() => String, { nullable: true })
  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name!: string | null;

  @Field()
  @Column("datetime", { name: "created_at" })
  createdAt!: Date;

  @Field()
  @Column("datetime", { name: "updated_at" })
  updatedAt!: Date;

  @Field(() => Int, { nullable: true })
  @Column("int", { name: "parent_id", nullable: true })
  parentId!: number | null;

  @Field(() => [IngredientNutrient])
  @OneToMany(() => IngredientNutrient, inRel => inRel.nutrient)
  ingredientNutrients!: IngredientNutrient[]

  @ManyToMany(() => Ingredient, (ingredient) => ingredient.nutrients)
  ingredients!: Ingredient[];

}
