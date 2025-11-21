import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { IngredientEntity } from "./IngredientEntity";
// import { DishIngredientEntity } from "./DishIngredientEntity";

@Entity("dishes", { schema: "health_development" })
export class DishEntity {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id!: number;

  // @OneToMany(() => DishIngredientEntity, di => di.dish)
  // dishIngredients!: DishIngredientEntity[];

  @ManyToMany(() => IngredientEntity, ingredient => ingredient.dishes)
  @JoinTable({
    name: "dish_ingredients",
    joinColumn: { name: "dish_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "ingredient_id", referencedColumnName: "id" },
  })
  ingredients!: IngredientEntity[];

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name!: string | null;

  @Column("datetime", { name: "created_at" })
  createdAt!: Date;

  @Column("datetime", { name: "updated_at" })
  updatedAt!: Date;
}

