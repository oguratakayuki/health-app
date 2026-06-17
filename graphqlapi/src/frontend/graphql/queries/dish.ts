import { gql } from "@apollo/client";

export const GET_DISHES = gql(`
  query GetDishes {
    prismaDishes {
      id
      name
    }
  }
`);

export const CREATE_DISH = gql(`
  mutation CreateDish($input: CreateDishInput!) {
    createDish(input: $input) {
      id
      name
    }
  }
`);

export const UPDATE_DISH = gql(`
  mutation UpdateDish($id: String!, $input: UpdateDishInput!) {
    updateDish(id: $id, input: $input) {
      id
      name
    }
  }
`);

export const DELETE_DISH = gql(`
  mutation DeleteDish($id: String!) {
    deleteDish(id: $id)
  }
`);

/* ⚠️ codegen対象外（スキーマ不一致）のため、コメントアウトのまま残します
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
*/
