import { ObjectType, Field, ID, Int } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType() // GraphQL用にデコレート
@Entity("nutrients", { schema: "health_development" })
export class Nutrient {
  @Field(() => ID) // GraphQL ID型として公開
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id!: string;

  @Field(() => String, { nullable: true })  // ← 明示的に型指定
  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name!: string | null;

  @Field()
  @Column("datetime", { name: "created_at" })
  createdAt!: Date;

  @Field()
  @Column("datetime", { name: "updated_at" })
  updatedAt!: Date;

  @Field(() => Int, { nullable: true })
  @Column("int", { name: "parent_id", nullable: true })
  parentId!: number | null;
}
