// src/frontend/graphql/queries/me.ts
import { gql } from "@apollo/client";

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      isAdmin
    }
  }
`;
