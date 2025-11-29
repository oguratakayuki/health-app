// src/graphql/queries/nutrient.ts
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
  mutation CreateNutrient($name: String!) {
    createNutrient(name: $name) {
      id
      name
      createdAt
      updatedAt
      parentId
    }
  }
`;

export const UPDATE_NUTRIENT = gql`
  mutation UpdateNutrient($id: Int!, $name: String!) {
    updateNutrient(id: $id, name: $name) {
      id
      name
      updatedAt
    }
  }
`;

export const DELETE_NUTRIENT = gql`
  mutation DeleteNutrient($id: Int!) {
    deleteNutrient(id: $id)
  }
`;

