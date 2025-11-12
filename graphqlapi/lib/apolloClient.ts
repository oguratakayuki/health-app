// lib/apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || "/api/graphql";

export function createApolloClient() {
  return new ApolloClient({
    ssrMode: false, // Client-only
    link: new HttpLink({
      uri: GRAPHQL_URL,
      credentials: "include",
    }),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            ingredientNutrients: {
              merge(existing = [], incoming: any[]) {
                return incoming;
              },
            },
          },
        },
      },
    }),
  });
}
