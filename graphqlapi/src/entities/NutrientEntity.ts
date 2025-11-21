import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Ingredient } from "./Ingredient";

@Entity("nutrients", { schema: "health_development" })
export class NutrientEntity {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id?: number;

  @Column("varchar", { name: "name", nullable: false, length: 255 })
  name!: string;

  @Column("datetime", { name: "created_at", nullable: false })
  createdAt!: Date;

  @Column("datetime", { name: "updated_at", nullable: false })
  updatedAt!: Date;

  @Column("int", { name: "parent_id", nullable: true })
  parentId?: number | null;

  // @Field(() => [IngredientNutrient])
  // @OneToMany(() => IngredientNutrient, inRel => inRel.nutrient)
  // ingredientNutrients!: IngredientNutrient[];

  @ManyToMany(() => Ingredient, ingredient => ingredient.nutrients)
  @JoinTable({
    name: "ingredient_nutrients",
    joinColumn: { name: "nutrient_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "ingredient_id", referencedColumnName: "id" }
  })
  ingredients?: Ingredient[];
}

