import { gql } from "@apollo/client";

// フィルター付きの栄養摂取基準取得クエリ
export const NUTRIENTS_INTAKE_STANDARDS_WITH_FILTERS_QUERY = gql`
  query GetNutrientsIntakeStandardsWithFilters($gender: String, $age: Int) {
    nutrientsIntakeStandardsWithFilters(gender: $gender, age: $age) {
      id
      content
      unit
      gender
      ageFrom
      ageTo
      createdAt
      updatedAt
      nutrient {
        id
        name
      }
    }
  }
`;

export const NUTRIENTS_INTAKE_STANDARDS_QUERY = gql`
  query GetNutrientsIntakeStandards {
    nutrientsIntakeStandards {
      id
      content
      unit
      gender
      ageFrom
      ageTo
      createdAt
      updatedAt
      nutrient {
        id
        name
      }
    }
  }
`;

export const NUTRIENTS_INTAKE_STANDARD_BY_ID_QUERY = gql`
  query GetNutrientsIntakeStandard($id: String!) {
    nutrientsIntakeStandard(id: $id) {
      id
      content
      unit
      gender
      ageFrom
      ageTo
      createdAt
      updatedAt
      nutrient {
        id
        name
      }
    }
  }
`;

export const NUTRIENTS_INTAKE_STANDARDS_BY_NUTRIENT_QUERY = gql`
  query GetNutrientsIntakeStandardsByNutrient($nutrientId: Int!) {
    nutrientsIntakeStandardsByNutrient(nutrientId: $nutrientId) {
      id
      content
      unit
      gender
      ageFrom
      ageTo
      createdAt
      updatedAt
      nutrient {
        id
        name
      }
    }
  }
`;

export const CREATE_NUTRIENTS_INTAKE_STANDARD_MUTATION = gql`
  mutation CreateNutrientsIntakeStandard(
    $input: CreateNutrientsIntakeStandardInput!
  ) {
    createNutrientsIntakeStandard(input: $input) {
      id
      content
      unit
      gender
      ageFrom
      ageTo
      createdAt
      updatedAt
      nutrient {
        id
        name
      }
    }
  }
`;

export const UPDATE_NUTRIENTS_INTAKE_STANDARD_MUTATION = gql`
  mutation UpdateNutrientsIntakeStandard(
    $id: String!
    $input: UpdateNutrientsIntakeStandardInput!
  ) {
    updateNutrientsIntakeStandard(id: $id, input: $input) {
      id
      content
      unit
      gender
      ageFrom
      ageTo
      createdAt
      updatedAt
      nutrient {
        id
        name
      }
    }
  }
`;

export const DELETE_NUTRIENTS_INTAKE_STANDARD_MUTATION = gql`
  mutation DeleteNutrientsIntakeStandard($id: String!) {
    deleteNutrientsIntakeStandard(id: $id)
  }
`;

// Input types
export const CREATE_NUTRIENTS_INTAKE_STANDARD_INPUT = gql`
  fragment CreateNutrientsIntakeStandardInputFields on CreateNutrientsIntakeStandardInput {
    nutrientId
    content
    unit
    gender
    ageFrom
    ageTo
  }
`;

export const UPDATE_NUTRIENTS_INTAKE_STANDARD_INPUT = gql`
  fragment UpdateNutrientsIntakeStandardInputFields on UpdateNutrientsIntakeStandardInput {
    nutrientId
    content
    unit
    gender
    ageFrom
    ageTo
  }
`;

// 全てのクエリとミューテーションをまとめたオブジェクト
export const NUTRIENTS_INTAKE_STANDARD_QUERIES = {
  GET_ALL: NUTRIENTS_INTAKE_STANDARDS_QUERY,
  GET_BY_ID: NUTRIENTS_INTAKE_STANDARD_BY_ID_QUERY,
  GET_BY_NUTRIENT: NUTRIENTS_INTAKE_STANDARDS_BY_NUTRIENT_QUERY,
  GET_WITH_FILTERS: NUTRIENTS_INTAKE_STANDARDS_WITH_FILTERS_QUERY,
  CREATE: CREATE_NUTRIENTS_INTAKE_STANDARD_MUTATION,
  UPDATE: UPDATE_NUTRIENTS_INTAKE_STANDARD_MUTATION,
  DELETE: DELETE_NUTRIENTS_INTAKE_STANDARD_MUTATION,
};
