import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { TagCategory } from "./TagCategory";

@ObjectType()
@Entity("tags")
export class Tag {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: string;

  @Field(() => String, { nullable: true })
  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name!: string | null;

  @Field(() => TagCategory)
  @ManyToOne(() => TagCategory, (category) => category.tags)
  category!: TagCategory;

  @Field()
  @Column("datetime", { name: "created_at" })
  createdAt!: Date;

  @Field()
  @Column("datetime", { name: "updated_at" })
  updatedAt!: Date;
}
