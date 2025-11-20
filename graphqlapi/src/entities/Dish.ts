import { ObjectType, Field, ID } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Ingredient } from "./Ingredient";
import { DishIngredient } from "./DishIngredient";

@ObjectType()
@Entity("dishes", { schema: "health_development" })
export class Dish {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id!: string;

  @Field(() => [DishIngredient])
  @OneToMany(() => DishIngredient, (di) => di.dish)
  dishIngredients!: DishIngredient[];

  @Field(() => [Ingredient])
  @ManyToMany(() => Ingredient, (ingredient) => ingredient.dishes)
  @JoinTable({
    name: "dish_ingredients",
    joinColumn: { name: "dish_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "ingredient_id", referencedColumnName: "id" },
  })
  ingredients!: Ingredient[];

  @Field(() => String, { nullable: true })
  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name!: string | null;

  @Field()
  @Column("datetime", { name: "created_at" })
  createdAt!: Date;

  @Field()
  @Column("datetime", { name: "updated_at" })
  updatedAt!: Date;
}
