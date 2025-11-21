import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("dish_ingredients", { schema: "health_development" })
export class DishIngredientEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;


  @Column("int", { name: "dish_id", nullable: true })
  dishId?: number | null;

  @Column("int", { name: "ingredient_id", nullable: true })
  ingredientId?: number | null;

  @Column("int", { name: "content_quantity", nullable: true })
  contentQuantity?: number | null;

  @Column("int", { name: "content_unit", nullable: true })
  contentUnit?: string | null;

  @Column("datetime", { name: "created_at", nullable: false })
  createdAt!: Date;

  @Column("datetime", { name: "updated_at", nullable: false })
  updatedAt!: Date;



}
