import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("index_ingredient_nutrients_on_ingredient_id", ["ingredientId"], {})
@Index("index_ingredient_nutrients_on_nutrient_id", ["nutrientId"], {})
@Entity("ingredient_nutrients", { schema: "health_development" })
export class IngredientNutrients {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id!: string;

  @Column("bigint", { name: "ingredient_id", nullable: true })
  ingredientId!: string | null;

  @Column("bigint", { name: "nutrient_id", nullable: true })
  nutrientId!: string | null;

  @Column("int", { name: "content_quantity", nullable: true })
  contentQuantity!: number | null;

  @Column("varchar", { name: "content_unit", nullable: true, length: 255 })
  contentUnit!: string | null;

  @Column("int", { name: "content_unit_per", nullable: true })
  contentUnitPer!: number | null;

  @Column("varchar", {
    name: "content_unit_per_unit",
    nullable: true,
    length: 255,
  })
  contentUnitPerUnit!: string | null;

  @Column("datetime", { name: "created_at" })
  createdAt!: Date;

  @Column("datetime", { name: "updated_at" })
  updatedAt!: Date;
}
