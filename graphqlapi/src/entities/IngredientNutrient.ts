import { ObjectType, Field, ID, Int } from "type-graphql";
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Index("index_ingredient_nutrients_on_ingredient_id", ["ingredientId"], {})
@Index("index_ingredient_nutrients_on_nutrient_id", ["nutrientId"], {})
@Entity("ingredient_nutrients", { schema: "health_development" })
export class IngredientNutrient {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id!: string;

  @Field(() => String, { nullable: true })
  @Column("bigint", { name: "ingredient_id", nullable: true })
  ingredientId!: string | null;

  @Field(() => String, { nullable: true })
  @Column("bigint", { name: "nutrient_id", nullable: true })
  nutrientId!: string | null;

  @Field(() => Int, { nullable: true })
  @Column("int", { name: "content_quantity", nullable: true })
  contentQuantity!: number | null;

  @Field(() => String, { nullable: true })
  @Column("varchar", { name: "content_unit", nullable: true, length: 255 })
  contentUnit!: string | null;

  @Field(() => Int, { nullable: true })
  @Column("int", { name: "content_unit_per", nullable: true })
  contentUnitPer!: number | null;

  @Field(() => String, { nullable: true })
  @Column("varchar", {
    name: "content_unit_per_unit",
    nullable: true,
    length: 255,
  })
  contentUnitPerUnit!: string | null;

  @Field()
  @Column("datetime", { name: "created_at" })
  createdAt!: Date;

  @Field()
  @Column("datetime", { name: "updated_at" })
  updatedAt!: Date;
}
