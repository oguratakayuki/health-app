import { gql } from "@apollo/client";

/* -------------------------------------------------------
 * dish_ingredients 一覧取得（dishId で絞り込み）
 * ----------------------------------------------------- */
export const GET_DISH_INGREDIENTS = gql`
  query GetDishIngredients($dishId: String!) {
    dishIngredients(dishId: $dishId) {
      id
      contentQuantity
      contentUnit
      ingredient {
        id
        name
      }
    }
  }
`;

/* -------------------------------------------------------
 * ingredients（全食材）一覧取得（セレクト用）
 * ----------------------------------------------------- */
export const GET_INGREDIENTS = gql`
  query GetIngredients {
    ingredients {
      id
      name
    }
  }
`;

/* -------------------------------------------------------
 * dish_ingredient 作成
 * ----------------------------------------------------- */
export const CREATE_DISH_INGREDIENT = gql`
  mutation CreateDishIngredient($input: CreateDishIngredientInput!) {
    createDishIngredient(input: $input) {
      id
      contentQuantity
      contentUnit
      ingredient {
        id
        name
      }
    }
  }
`;

/* -------------------------------------------------------
 * dish_ingredient 更新
 * ----------------------------------------------------- */
export const UPDATE_DISH_INGREDIENT = gql`
  mutation UpdateDishIngredient(
    $id: String!
    $input: UpdateDishIngredientInput!
  ) {
    updateDishIngredient(id: $id, input: $input) {
      id
      contentQuantity
      contentUnit
    }
  }
`;

/* -------------------------------------------------------
 * dish_ingredient 削除
 * ----------------------------------------------------- */
export const DELETE_DISH_INGREDIENT = gql`
  mutation DeleteDishIngredient($id: String!) {
    deleteDishIngredient(id: $id)
  }
`;
