import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Index("index_users_on_email", ["email"], { unique: true })
@Entity("users", { schema: "health_development" })
export class UserEntity {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id!: string;

  @Column("varchar", { name: "email", unique: true, length: 255 })
  email!: string;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name?: string | null;

  @Column({ unique: true, name: "cognito_sub" })
  cognitoSub?: string;

  @Column("tinyint", { 
    name: "is_admin", 
    nullable: false, 
    default: () => "0"
  })
  isAdmin!: boolean;

  @Column("datetime", { name: "created_at" })
  createdAt!: Date;

  @Column("datetime", { name: "updated_at" })
  updatedAt!: Date;
}
