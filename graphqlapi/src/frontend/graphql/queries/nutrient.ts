import { gql } from "@apollo/client";

export const GET_NUTRIENTS = gql`
  query GetNutrients {
    prismaNutrients {
      id
      name
      createdAt
      updatedAt
      parentId
    }
  }
`;

export const CREATE_NUTRIENT = gql`
  # 💡 引数を $input: CreateNutrientInput! に変更
  mutation CreateNutrient($input: CreateNutrientInput!) {
    createPrismaNutrient(input: $input) {
      id
      name
      createdAt
      updatedAt
      parentId
    }
  }
`;

export const UPDATE_NUTRIENT = gql`
  # 💡 $id を String! に変更、かつ $input: UpdateNutrientInput! を追加
  mutation UpdateNutrient($id: String!, $input: UpdateNutrientInput!) {
    updatePrismaNutrient(id: $id, input: $input) {
      id
      name
      updatedAt
    }
  }
`;

export const DELETE_NUTRIENT = gql`
  # 💡 Error 11 より、削除の $id も String! を要求されている可能性が高いため String! に変更
  mutation DeleteNutrient($id: String!) {
    deletePrismaNutrient(id: $id)
  }
`;
