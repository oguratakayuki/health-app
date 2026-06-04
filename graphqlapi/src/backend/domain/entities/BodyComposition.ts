export interface BodyComposition {
  id: string;
  userId: string;
  weight: number; // 体重 (kg)
  bmi: number; // BMI（体格指数）
  bodyFatPercentage: number; // 体脂肪率 (%)
  bodyFatMass: number; // 体脂肪量 (kg)
  skeletalMusclePercentage: number; // 骨格筋率 (%)
  skeletalMuscleMass: number; // 骨格筋量 (kg)
  subcutaneousFatPercentage: number; // 皮下脂肪率 (%)
  ffmi: number; // FFMI（除脂肪量指数）
  boneMass: number; // 骨量 (kg)
  visceralFatLevel: number; // 内臓脂肪レベル
  basalMetabolism: number; // 基礎代謝量 (kcal)
  measuredAt: Date; // 計測日時
  createdAt: Date; // レコード作成日時
  updatedAt: Date; // レコード更新日時
}
