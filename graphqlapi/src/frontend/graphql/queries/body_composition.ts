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

export const GET_BODY_COMPOSITION = gql`
  query GetBodyComposition($input: ShowBodyCompositionInput!) {
    bodyComposition(input: $input) {
      id
      userId
      measuredAt
      weight
      bmi
      bodyFatPercentage
      bodyFatMass
      subcutaneousFatPercentage
      visceralFatLevel
      skeletalMusclePercentage
      skeletalMuscleMass
      ffmi
      boneMass
      basalMetabolism
      createdAt
      updatedAt
    }
  }
`;

