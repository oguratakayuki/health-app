// graphqlapi/src/services/cognitoService.ts
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import { getCognitoConfig } from "../config/cognito";

export class CognitoService {
  private userPool: CognitoUserPool;

  constructor() {
    const config = getCognitoConfig();
    this.userPool = new CognitoUserPool({
      UserPoolId: config.userPoolId,
      ClientId: config.clientId,
    });
  }

  async signIn(email: string, password: string) {
    const authDetails = new AuthenticationDetails({ Username: email, Password: password });
    const user = new CognitoUser({ Username: email, Pool: this.userPool });

    return new Promise((resolve, reject) => {
      user.authenticateUser(authDetails, {
        onSuccess: resolve,
        onFailure: reject,
      });
    });
  }

  // initializeメソッドがcontextで呼ばれているので、最低限のダミーを追加
  async initialize() {
    // 将来的に設定処理を追加するならここに
    return Promise.resolve();
  }

  async getCurrentUser() {
    // ここではまだトークンの仕組みを実装していないのでnull返却
    return null;
  }

}

export const cognitoService = new CognitoService();
