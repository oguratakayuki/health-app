import { gql } from "@apollo/client";

export const GET_INGREDIENT_NUTRIENTS = gql`
  query GetIngredientNutrients {
    ingredientNutrients {
      id
      contentQuantity
      contentUnit
      contentUnitPer
      contentUnitPerUnit
      ingredient {
        id
        name
      }
      nutrient {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;
