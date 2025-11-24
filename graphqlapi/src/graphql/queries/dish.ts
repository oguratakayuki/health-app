import { gql } from "@apollo/client";

export const GET_DISHES = gql`
  query GetDishes {
    prismaDishes {
      id
      name
    }
  }
`;

export const GET_DISH = gql`
  query GetDish($id: String!) {
    dish(id: $id) {
      id
      name
    }
  }
`;

export const CREATE_DISH = gql`
  mutation CreateDish($name: String!) {
    createDish(name: $name) {
      id
      name
    }
  }
`;

export const UPDATE_DISH = gql`
  mutation UpdateDish($id: String!, $name: String!) {
    updateDish(id: $id, name: $name) {
      id
      name
    }
  }
`;

export const DELETE_DISH = gql`
  mutation DeleteDish($id: String!) {
    deleteDish(id: $id)
  }
`;
export const GET_DISH_WITH_INGREDIENTS = gql`
  query Dish($id: Int!) {
    dish(id: $id) {
      id
      name
      dishIngredients {
        id
        ingredient {
          id
          name
        }
        ingredient_id
        content_quantity
        content_unit
      }
    }
  }
`;
