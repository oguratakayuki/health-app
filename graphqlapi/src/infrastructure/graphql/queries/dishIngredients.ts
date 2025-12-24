import { gql } from "@apollo/client";

export const UPDATE_DISH_INGREDIENTS = gql`
  mutation UpdateDishIngredients($dishId: Int!, $items: [DishIngredientInput!]!) {
    updateDishIngredients(dishId: $dishId, items: $items) {
      id
    }
  }
`;


/* -------------------------------------------------------
 *  dish_ingredients 一覧取得（dishId で絞り込み）
 * ----------------------------------------------------- */
export const GET_DISH_INGREDIENTS = gql`
  query GetDishIngredients($dishId: Int!) {
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
 *  ingredients（全食材）一覧取得（セレクト用）
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
 *  dish_ingredient 作成
 * ----------------------------------------------------- */
export const CREATE_DISH_INGREDIENT = gql`
  mutation CreateDishIngredient(
    $dishId: Int!
    $ingredientId: Int!
    $contentQuantity: Float!
    $contentUnit: String!
  ) {
    createDishIngredient(
      dishId: $dishId
      ingredientId: $ingredientId
      contentQuantity: $contentQuantity
      contentUnit: $contentUnit
    ) {
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
 *  dish_ingredient 更新
 * ----------------------------------------------------- */
export const UPDATE_DISH_INGREDIENT = gql`
  mutation UpdateDishIngredient(
    $id: Int!
    $contentQuantity: Float!
    $contentUnit: String!
  ) {
    updateDishIngredient(
      id: $id
      contentQuantity: $contentQuantity
      contentUnit: $contentUnit
    ) {
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
 *  dish_ingredient 削除
 * ----------------------------------------------------- */
export const DELETE_DISH_INGREDIENT = gql`
  mutation DeleteDishIngredient($id: Int!) {
    deleteDishIngredient(id: $id)
  }
`;

