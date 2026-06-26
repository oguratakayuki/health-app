import { gql } from "@apollo/client";

export const GET_INGREDIENTS = gql`
  query {
    ingredients {
      id
      name
    }
  }
`;

export const CREATE_INGREDIENT = gql`
  mutation CreateIngredient($input: CreateIngredientInput!) {
    createIngredient(input: $input) {
      id
      name
    }
  }
`;

export const UPDATE_INGREDIENT = gql`
  mutation UpdateIngredient($id: String!, $input: UpdateIngredientInput!) {
    updateIngredient(id: $id, input: $input) {
      id
      name
    }
  }
`;

export const DETAIL_INGREDIENT = gql`
  query ($id: ID!) {
    ingredient(id: $id) {
      id
      name
      createdAt
      updatedAt
      nutrients {
        id
        name
      }
    }
  }
`;

export const DELETE_INGREDIENT = gql`
  mutation ($id: ID!) {
    deleteIngredient(id: $id)
  }
`;
