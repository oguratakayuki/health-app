// lib/apolloClient.ts
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { TokenService } from "@/frontend/auth/services/TokenService";

const httpLink = createHttpLink({
  uri: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/graphql`,
  credentials: "include",
});

const authLink = setContext((_, { headers }) => {
  const tokenService = TokenService.getInstance();
  const token = tokenService.getIdToken(); // IDトークンを取得
  console.log("Apollo Client authLink:", {
    hasToken: !!token,
    tokenPreview: token?.substring(0, 50),
    token: token,
  });
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "network-only",
    },
  },
});

export function getApolloClient() {
  return apolloClient;
}
