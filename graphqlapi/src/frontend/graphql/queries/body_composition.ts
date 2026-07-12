import { gql } from "@apollo/client";

export const GET_BODY_COMPOSITIONS = gql`
  query GetBodyCompositions($input: ListBodyCompositionInput) {
    bodyCompositions(input: $input) {
      id
      userId
      measuredAt
      weight
      bmi
      bodyFatPercentage
      skeletalMusclePercentage
      createdAt
      updatedAt
    }
  }
`;
