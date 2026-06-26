import { gql } from "@apollo/client";

// 💡 編集ページ用に単一取得クエリを追加
export const GET_NUTRIENT = gql`
  query GetNutrient($id: String!) {
    nutrient(id: $id) {
      id
      name
      code
      parentId
    }
  }
`;

export const GET_NUTRIENTS = gql`
  query GetNutrients {
    nutrients {
      id
      name
      code
      createdAt
      updatedAt
      parentId
    }
  }
`;

export const CREATE_NUTRIENT = gql`
  mutation CreateNutrient($input: CreateNutrientInput!) {
    createNutrient(input: $input) {
      id
      name
      code
      createdAt
      updatedAt
      parentId
    }
  }
`;

export const UPDATE_NUTRIENT = gql`
  mutation UpdateNutrient($id: String!, $input: UpdateNutrientInput!) {
    updateNutrient(id: $id, input: $input) {
      id
      name
      code
      updatedAt
    }
  }
`;

export const DELETE_NUTRIENT = gql`
  mutation DeleteNutrient($id: String!) {
    deleteNutrient(id: $id)
  }
`;
