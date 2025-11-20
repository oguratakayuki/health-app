import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import { Nutrient } from './Nutrient'
import { Dish } from './Dish'
import { DishIngredient } from './DishIngredient'
import { IngredientNutrient } from './IngredientNutrient'

@ObjectType()
@Entity("ingredients", { schema: "health_development" })
export class Ingredient {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column()
  name!: string

  // OneToMany は JoinTable 不要
  @OneToMany(() => DishIngredient, (dishIngredient) => dishIngredient.ingredient)
  dishIngredients!: DishIngredient[]

  // @OneToMany(() => IngredientNutrient, (ingredientNutrient) => ingredientNutrient.ingredient)
  // ingredientNutrients!: IngredientNutrient[]

  // ManyToMany Nutrient
  @ManyToMany(() => Nutrient, (nutrient) => nutrient.ingredients)
  @JoinTable({
    name: "ingredient_nutrients",
    joinColumn: { name: "ingredient_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "nutrient_id", referencedColumnName: "id" }
  })
  nutrients!: Nutrient[]

  // ManyToMany Dish
  @ManyToMany(() => Dish, (dish) => dish.ingredients)
  @JoinTable({
    name: "dish_ingredients",
    joinColumn: { name: "ingredient_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "dish_id", referencedColumnName: "id" }
  })
  dishes!: Dish[]
}
