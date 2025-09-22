import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Tag } from "./Tag";

@ObjectType()
@Entity()
export class TagCategory {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field(() => [Tag])
  @OneToMany(() => Tag, (tag) => tag.category)
  tags!: Tag[];
}

