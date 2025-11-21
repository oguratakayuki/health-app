import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ObjectType, Field, ID } from 'type-graphql'
import { Nutrient } from './Nutrient'
import { Dish } from './Dish'
// import { DishIngredient } from './DishIngredient'
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

  // @Field(() => [DishIngredient])
  // dishIngredients?: DishIngredient[];

  @Field(() => [Nutrient])
  nutrients?: Nutrient[];

  @Field(() => [IngredientNutrient])
  ingredient_nutrients?: IngredientNutrient[];

  @Field(() => [Dish])
  dishes?: Dish[];

  @Field()
  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({ name: "created_at" })
  updatedAt!: Date;



}
