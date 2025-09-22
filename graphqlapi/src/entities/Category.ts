import { ObjectType, Field, ID } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType() // ← GraphQL用に追加
@Entity("categories", { schema: "health_development" })
export class Category {
  @Field(() => ID) // GraphQL ID型として公開
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id!: string;

  @Field(() => String, { nullable: true })
  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name!: string | null;

  @Field(() => String, { nullable: true })
  @Column("varchar", { name: "display_name", nullable: true, length: 255 })
  displayName!: string | null;

  @Field()
  @Column("datetime", { name: "created_at" })
  createdAt!: Date;

  @Field()
  @Column("datetime", { name: "updated_at" })
  updatedAt!: Date;
}

