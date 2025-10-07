import { NextApiRequest, NextApiResponse } from "next";
import { cognitoService } from "./services/cognitoService";

export interface GraphQLContext {
  req: NextApiRequest;
  res: NextApiResponse;
  user?: any; // 認証されたユーザー
}

export async function createContext({ req, res }: { req: NextApiRequest; res: NextApiResponse }): Promise<GraphQLContext> {
  // Cognitoサービスを初期化
  await cognitoService.initialize();

  // 認証トークンからユーザーを取得
  let user = null;
  try {
    user = await cognitoService.getCurrentUser();
  } catch (error) {
    // 認証されていない場合は無視
  }

  return {
    req,
    res,
    user
  };
}
