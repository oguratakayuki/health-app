import { gql } from "@apollo/client";

// 💡 不足していた単一取得用のクエリを追加しました
export const GET_DISH = gql(`
  query GetDish($id: String!) {
    dish(id: $id) {
      id
      name
      createdAt
      updatedAt
    }
  }
`);

export const GET_DISHES = gql(`
  query GetDishes {
    dishes {
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
