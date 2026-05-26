
import { gql } from "@apollo/client";

export const GET_MEALS = gql`
  query GetMeals($from: String!, $to: String!) {
    meals(from: $from, to: $to) {
      id
      name
      mealDate
      category
      dishes {
        id
        name
      }
    }
  }
`;

export const GET_MEAL = gql`
  query GetMeal($id: String!) {
    meal(id: $id) {
      id
      name
      mealDate
      category
    }
  }
`;

export const GET_MEALS_WITH_DISHES = gql`
  query GetMealsWithDishes($from: String!, $to: String!) {
    mealsWithDishes(from: $from, to: $to) {
      id
      name
      mealDate
      category
      dishes {
        id
        name
      }
    }
  }
`;

export const GET_MEAL_WITH_DISHES = gql`
  query GetMealWithDishes($id: String!) {
    mealWithDishes(id: $id) {
      id
      name
      mealDate
      category
      dishes {
        id
        name
      }
    }
  }
`;

export const CREATE_MEAL = gql`
  mutation CreateMeal($input: CreateMealWithDishesInput!) {
    createMealWithDishes(input: $input) {
      id
      name
    }
  }
`;

export const UPDATE_MEAL = gql`
  mutation UpdateMeal($id: String!, $input: UpdateMealInput!) {
    updateMeal(id: $id, input: $input) {
      id
      name
    }
  }
`;

export const DELETE_MEAL = gql`
  mutation DeleteMeal($id: String!) {
    deleteMeal(id: $id)
  }
`;
