import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import { Nutrient } from './Nutrient'

@ObjectType()
@Entity("ingredients")
export class Ingredient {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column()
  name!: string

  @ManyToMany(() => Nutrient, (nutrient) => nutrient.ingredients)
  @JoinTable({
    name: "ingredient_nutrients", // 中間テーブル名
    joinColumn: { name: "ingredient_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "nutrient_id", referencedColumnName: "id" }
  })
  nutrients!: Nutrient[];

}
