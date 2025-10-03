import { ObjectType, Field, ID } from "type-graphql";
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("index_users_on_email", ["email"], { unique: true })
@ObjectType() // ← GraphQL用
@Entity("users", { schema: "health_development" })
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id!: string;

  @Field(() => String, { nullable: false })
  @Column("varchar", { name: "email", unique: true, length: 255 })
  email!: string;

  @Field(() => String, { nullable: true })
  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name!: string | null;

  @Field(() => String, { nullable: true })
  @Column("varchar", { name: "cognito_sub", nullable: true, length: 255 })
  cognito_sub!: string | null;

  @Field()
  @Column("datetime", { name: "created_at" })
  createdAt!: Date;

  @Field()
  @Column("datetime", { name: "updated_at" })
  updatedAt!: Date;
}
