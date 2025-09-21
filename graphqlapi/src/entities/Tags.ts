import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("tags", { schema: "health_development" })
export class Tags {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id!: string;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name!: string | null;

  @Column("datetime", { name: "created_at" })
  createdAt!: Date;

  @Column("datetime", { name: "updated_at" })
  updatedAt!: Date;
}
