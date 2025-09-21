import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("tag_categories", { schema: "health_development" })
export class TagCategories {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id!: string;

  @Column("int", { name: "tag_id", nullable: true })
  tagId!: number | null;

  @Column("int", { name: "category_id", nullable: true })
  categoryId!: number | null;

  @Column("datetime", { name: "created_at" })
  createdAt!: Date;

  @Column("datetime", { name: "updated_at" })
  updatedAt!: Date;
}
