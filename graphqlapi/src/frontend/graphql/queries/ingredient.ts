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
  mutation ($name: String!) {
    createIngredient(name: $name) {
      id
      name
    }
  }
`;

export const UPDATE_INGREDIENT = gql`
  mutation ($id: ID!, $name: String!) {
    updateIngredient(id: $id, name: $name) {
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
