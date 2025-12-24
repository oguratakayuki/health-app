// src/__tests__/utils/graphql-test-utils.ts
/**
 * GraphQLテスト用のユーティリティ関数
 */

export const createGraphQLRequest = (query: string, variables?: any, token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return {
    method: 'POST' as const,
    headers,
    body: JSON.stringify({
      query,
      variables: variables || {},
    }),
  };
};

export const expectGraphQLSuccess = async (response: Response) => {
  expect(response.status).toBe(200);
  const data = await response.json();
  expect(data.errors).toBeUndefined();
  return data.data;
};

export const expectGraphQLError = async (response: Response, expectedError?: string) => {
  expect(response.status).toBe(200); // GraphQLエラーは200を返す
  const data = await response.json();
  expect(data.errors).toBeDefined();
  if (expectedError) {
    expect(data.errors[0].message).toContain(expectedError);
  }
  return data.errors;
};

/**
 * テスト用のGraphQLクライアント
 */
export class TestGraphQLClient {
  constructor(private baseUrl: string, private token?: string) {}
  async query<T = any>(query: string, variables?: any): Promise<T> {
    const response = await fetch(this.baseUrl, createGraphQLRequest(query, variables, this.token));
    const data = await response.json();
    if (data.errors) {
      throw new Error(`GraphQL Error: ${JSON.stringify(data.errors)}`);
    }
    return data.data as T;
  }
  async mutate<T = any>(mutation: string, variables?: any): Promise<T> {
    return this.query<T>(mutation, variables);
  }
}
