import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("ingredients", { schema: "health_development" })
export class Ingredients {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id!: string;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name!: string | null;

  @Column("text", { name: "remarks", nullable: true })
  remarks!: string | null;

  @Column("datetime", { name: "created_at" })
  createdAt!: Date;

  @Column("datetime", { name: "updated_at" })
  updatedAt!: Date;

  @Column("varchar", { name: "original_name", nullable: true, length: 255 })
  originalName!: string | null;
}
