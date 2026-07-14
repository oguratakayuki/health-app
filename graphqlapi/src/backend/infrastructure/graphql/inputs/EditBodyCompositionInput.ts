import { InputType, Field, ID } from "type-graphql";

@InputType()
export class EditBodyCompositionInput {
  @Field(() => ID)
  id!: string;

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
}
