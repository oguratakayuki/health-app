// lib/apolloClient.ts
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const httpLink = createHttpLink({
  uri: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/graphql`,
  credentials: "include", // cookie自動送信
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "network-only",
    },
    query: {
      fetchPolicy: "network-only",
    },
  },
});

export function getApolloClient() {
  return apolloClient;
}
