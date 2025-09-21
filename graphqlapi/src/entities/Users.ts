import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("index_users_on_email", ["email"], { unique: true })
@Index("index_users_on_reset_password_token", ["resetPasswordToken"], {
  unique: true,
})
@Entity("users", { schema: "health_development" })
export class Users {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id!: string;

  @Column("varchar", { name: "email", unique: true, length: 255 })
  email!: string;

  @Column("varchar", { name: "encrypted_password", length: 255 })
  encryptedPassword!: string;

  @Column("varchar", {
    name: "reset_password_token",
    nullable: true,
    unique: true,
    length: 255,
  })
  resetPasswordToken!: string | null;

  @Column("datetime", { name: "reset_password_sent_at", nullable: true })
  resetPasswordSentAt!: Date | null;

  @Column("datetime", { name: "remember_created_at", nullable: true })
  rememberCreatedAt!: Date | null;

  @Column("datetime", { name: "created_at" })
  createdAt!: Date;

  @Column("datetime", { name: "updated_at" })
  updatedAt!: Date;
}
