import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { NutrientEntity } from "./NutrientEntity";
import { DishEntity } from "./DishEntity";
import { DishIngredientEntity } from "./DishIngredientEntity";

@Entity("ingredients", { schema: "health_development" })
export class IngredientEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  // @OneToMany(() => DishIngredientEntity, dishIngredient => dishIngredient.ingredient)
  // dishIngredients!: DishIngredientEntity[];

  @ManyToMany(() => NutrientEntity, nutrient => nutrient.ingredients)
  @JoinTable({
    name: "ingredient_nutrients",
    joinColumn: { name: "ingredient_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "nutrient_id", referencedColumnName: "id" },
  })
  nutrients!: NutrientEntity[];

  @ManyToMany(() => DishEntity, dish => dish.ingredients)
  @JoinTable({
    name: "dish_ingredients",
    joinColumn: { name: "ingredient_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "dish_id", referencedColumnName: "id" },
  })
  dishes!: DishEntity[];

  @Column("datetime", { name: "created_at", nullable: false })
  createdAt!: Date;

  @Column("datetime", { name: "updated_at", nullable: false })
  updatedAt!: Date;

}
