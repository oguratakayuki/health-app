import { gql } from "@apollo/client";

export const DAILY_NUTRITION_QUERY = gql`
  query GetDailyNutrition($date: String!) {
    dailyNutrition(date: $date) {
      totals {
        nutrientCode
        value
      }

      pfc {
        protein
        fat
        carbohydrate
      }

      comparisons {
        nutrientCode
        intake
        target
        percentage
      }
    }
  }
`;

export const DAILY_NUTRITION_QUERIES = {
  GET_DAILY_NUTRITION: DAILY_NUTRITION_QUERY,
};
