// backend/domain/types/NutrientCode.ts

export enum NutrientCode {
  Energy = "energy_kcal",

  Protein = "protein_g",
  Fat = "fat_g",
  Carbohydrate = "carbohydrate_g",

  Fiber = "fiber_g",
  Salt = "salt_g",

  VitaminA = "vitamin_a_ug",
  VitaminC = "vitamin_c_mg",

  Calcium = "calcium_mg",
  Iron = "iron_mg",
}
export function toNutrientCode(code: string): NutrientCode {
  switch (code) {
    case "energy_kcal":
      return NutrientCode.Energy;
    case "protein_g":
      return NutrientCode.Protein;
    case "fat_g":
      return NutrientCode.Fat;
    case "carbohydrate_g":
      return NutrientCode.Carbohydrate;
    case "fiber_g":
      return NutrientCode.Fiber;
    case "vitamin_a_ug":
      return NutrientCode.VitaminA;
    case "vitamin_c_mg":
      return NutrientCode.VitaminC;
    // case "vitamin_d_ug": return NutrientCode.VitaminD;
    case "calcium_mg":
      return NutrientCode.Calcium;
    case "iron_mg":
      return NutrientCode.Iron;
    // case "zinc_mg": return NutrientCode.Zinc;
    // case "potassium_mg": return NutrientCode.Potassium;
    default:
      throw new Error(`Unknown nutrient code: ${code}`);
  }
}
