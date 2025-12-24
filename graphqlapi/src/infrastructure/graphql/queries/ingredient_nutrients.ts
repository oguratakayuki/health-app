import { gql } from "@apollo/client";

export const INGREDIENT_NUTRIENTS_QUERY = gql`
  query GetIngredientNutrients($limit: Int) {
    ingredientNutrients(limit: $limit) {
      id
      ingredient {
        name
      }
      nutrient {
        name
      }
      contentQuantity
      contentUnit
      contentUnitPer
      contentUnitPerUnit
    }
  }
`;



