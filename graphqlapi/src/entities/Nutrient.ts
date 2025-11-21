import { ObjectType, Field, ID, Int } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Ingredient } from "./Ingredient";

@ObjectType()
@Entity("nutrients", { schema: "health_development" })
export class Nutrient {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id?: string;

  @Field(() => String, { nullable: true })
  @Column("varchar", { name: "name", nullable: false, length: 255 })
  name!: string;

  @Field()
  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({ name: "created_at" })
  updatedAt!: Date;

  @Field(() => Int, { nullable: true })
  @Column("int", { name: "parent_id", nullable: true })
  parentId?: number | null;

  @Field(() => [Ingredient])
  ingredients?: Ingredient[];
}

