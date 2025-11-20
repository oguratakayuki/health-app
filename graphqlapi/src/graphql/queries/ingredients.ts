import { gql } from "@apollo/client";

export const GET_INGREDIENTS = gql`
  query Ingredients {
    ingredients {
      id
      name
    }
  }
`;

