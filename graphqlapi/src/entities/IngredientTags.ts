import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("ingredient_tags", { schema: "health_development" })
export class IngredientTags {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id!: string;

  @Column("int", { name: "ingredient_id", nullable: true })
  ingredientId!: number | null;

  @Column("int", { name: "tag_id", nullable: true })
  tagId!: number | null;

  @Column("datetime", { name: "created_at" })
  createdAt!: Date;

  @Column("datetime", { name: "updated_at" })
  updatedAt!: Date;
}
