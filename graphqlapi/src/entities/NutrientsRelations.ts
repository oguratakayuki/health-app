import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("nutrients_relations", { schema: "health_development" })
export class NutrientsRelations {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id!: string;

  @Column("int", { name: "parent_id", nullable: true })
  parentId!: number | null;

  @Column("int", { name: "child_id", nullable: true })
  childId!: number | null;

  @Column("datetime", { name: "created_at" })
  createdAt!: Date;

  @Column("datetime", { name: "updated_at" })
  updatedAt!: Date;
}
