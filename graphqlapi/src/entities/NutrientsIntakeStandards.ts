import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("nutrients_intake_standards", { schema: "health_development" })
export class NutrientsIntakeStandards {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id!: string;

  @Column("int", { name: "nutrient_id", nullable: true })
  nutrientId!: number | null;

  @Column("int", { name: "content", nullable: true })
  content!: number | null;

  @Column("int", { name: "unit", nullable: true })
  unit!: number | null;

  @Column("int", { name: "gender", nullable: true })
  gender!: number | null;

  @Column("datetime", { name: "created_at" })
  createdAt!: Date;

  @Column("datetime", { name: "updated_at" })
  updatedAt!: Date;

  @Column("decimal", {
    name: "age_from",
    nullable: true,
    precision: 10,
    scale: 0,
  })
  ageFrom!: string | null;

  @Column("decimal", {
    name: "age_to",
    nullable: true,
    precision: 10,
    scale: 0,
  })
  ageTo!: string | null;
}
