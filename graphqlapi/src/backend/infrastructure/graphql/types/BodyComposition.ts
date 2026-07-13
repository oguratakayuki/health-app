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
  bodyFatMass!: number;

  @Field()
  subcutaneousFatPercentage!: number;

  @Field()
  visceralFatLevel!: number;

  @Field()
  skeletalMusclePercentage!: number;

  @Field()
  skeletalMuscleMass!: number;

  @Field()
  ffmi!: number;

  @Field()
  boneMass!: number;

  @Field()
  basalMetabolism!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
