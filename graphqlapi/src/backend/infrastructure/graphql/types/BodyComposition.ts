import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class BodyComposition {
  @Field(() => ID)
  id!: string;

  @Field()
  userId!: string;

  @Field()
  measuredAt!: Date;

  @Field()
  weight!: number;

  @Field()
  bmi!: number;

  @Field()
  bodyFatPercentage!: number;

  @Field()
  skeletalMusclePercentage!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
