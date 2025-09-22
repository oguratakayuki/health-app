import { Field, Int, ObjectType } from "type-graphql";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Ingredient } from "./Ingredient";
import { Tag } from "./Tag";

@ObjectType()
@Entity("ingredient_tags")
export class IngredientTag {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Int)
  @Column({ name: "ingredient_id" })
  ingredientId!: number;

  @Field(() => Int)
  @Column({ name: "tag_id" })
  tagId!: number;

  @Field(() => Ingredient)
  @ManyToOne(() => Ingredient)
  @JoinColumn({ name: "ingredient_id" })
  ingredient!: Ingredient;

  @Field(() => Tag)
  @ManyToOne(() => Tag)
  @JoinColumn({ name: "tag_id" })
  tag!: Tag;
}
