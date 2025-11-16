import { ObjectType, Field, ID  } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn  } from "typeorm";

@ObjectType()
@Entity("dishes", { schema: "health_development" })
export class Dish {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id!: string;

  @Field(() => String, { nullable: true })
  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name!: string | null;

  @Field()
  @Column("datetime", { name: "created_at" })
  createdAt?: Date;

  @Field()
  @Column("datetime", { name: "updated_at" })
  updatedAt?: Date;
}
