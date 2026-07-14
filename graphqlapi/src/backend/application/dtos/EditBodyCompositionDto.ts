export interface EditBodyCompositionDto {
  id: string;
  userId: string;
  measuredAt: Date;
  weight: number;
  bmi: number;
  bodyFatPercentage: number;
  bodyFatMass: number;
  subcutaneousFatPercentage: number;
  visceralFatLevel: number;
  skeletalMusclePercentage: number;
  skeletalMuscleMass: number;
  ffmi: number;
  boneMass: number;
  basalMetabolism: number;
}
