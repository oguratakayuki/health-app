// lib/apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || "/api/graphql";

// HTTPリンク
const httpLink = new HttpLink({
  uri: GRAPHQL_URL,
  credentials: "include", // クッキーも送信（フォールバック用）
});

// 認証リンク - Authorizationヘッダーを追加
const authLink = setContext((_, { headers }) => {
  // クライアントサイドでのみ実行
  if (typeof window === 'undefined') {
    return { headers };
  }
  // クッキーからidTokenを取得
  const cookies = document.cookie.split(';');
  const idTokenCookie = cookies.find(c => c.trim().startsWith('idToken='));
  const token = idTokenCookie ? decodeURIComponent(idTokenCookie.split('=')[1]) : null;
  // デバッグログ
  if (token) {
    console.log("🔐 Apollo Client - Adding Authorization header with token");
  } else {
    console.warn("⚠️ Apollo Client - No idToken found in cookies");
  }
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// リンクを結合（authLink → httpLink の順序が重要）
const combinedLink = from([authLink, httpLink]);

export function createApolloClient() {
  return new ApolloClient({
    ssrMode: false, // Client-only
    link: combinedLink,
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
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only', // キャッシュの問題を避けるため
      },
    },
  });
}

// シングルトンインスタンス
let apolloClientInstance: ApolloClient<any> | null = null;

export function getApolloClient() {
  if (!apolloClientInstance) {
    apolloClientInstance = createApolloClient();
  }
  return apolloClientInstance;
}

// 後方互換性のためのデフォルトエクスポート
export default getApolloClient();
