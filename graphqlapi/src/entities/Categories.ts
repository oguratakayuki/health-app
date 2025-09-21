import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("categories", { schema: "health_development" })
export class Categories {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id!: string;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name!: string | null;

  @Column("varchar", { name: "display_name", nullable: true, length: 255 })
  displayName!: string | null;

  @Column("datetime", { name: "created_at" })
  createdAt!: Date;

  @Column("datetime", { name: "updated_at" })
  updatedAt!: Date;
}
