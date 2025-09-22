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

  @Field(() => [Nutrient])
  @ManyToMany(() => Nutrient)
  @JoinTable()
  nutrients!: Nutrient[]
}
