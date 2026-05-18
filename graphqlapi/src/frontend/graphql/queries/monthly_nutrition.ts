import { gql } from "@apollo/client";

export const MONTHLY_NUTRITION_QUERY = gql`
  query GetMonthlyNutrition($from: String!, $to: String!) {
    monthlyNutrition(from: $from, to: $to) {
      days {
        date

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
  }
`;

export const MONTHLY_NUTRITION_QUERIES = {
  GET_MONTHLY_NUTRITION: MONTHLY_NUTRITION_QUERY,
};
