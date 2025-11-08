// graphqlapi/src/services/cognitoService.ts
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
import { getCognitoConfig } from "../config/cognito";
import { userService } from '../../src/services/userService'; // DB操作用
import { initializeDataSource } from '../../src/data-source'; // TypeORM初期化用
import { jwtDecode } from "jwt-decode";

interface SignUpResult {
  user: CognitoUser;
  userConfirmed: boolean;
  codeDeliveryDetails: {
    Destination: string;
    DeliveryMedium: string;
    AttributeName: string;
  };
}

export class CognitoService {
  private userPool: CognitoUserPool;

  constructor() {
    const config = getCognitoConfig();
    this.userPool = new CognitoUserPool({
      UserPoolId: config.userPoolId,
      ClientId: config.clientId,
    });
    if (config.endpoint) {
      const client = (this.userPool as any).client; 
      if (client) {
        client.endpoint = config.endpoint; 
        console.log(`Cognito endpoint set to: ${client.endpoint}`);
      }
    }

  }

  async signIn(username: string, password: string): Promise<{
    idToken: string;
    accessToken: string;
    refreshToken?: string;
  }> {
    if (!username || !password) {
      throw new Error("Missing username or password");
    }

    // DB初期化
    try {
      await initializeDataSource();
    } catch (error) {
      console.error("Database initialization failed:", error);
      throw new Error("Server configuration error (DB init).");
    }

    // Cognito Local にリクエスト
    const response = await fetch("http://cognito-local:9229/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
      },
      body: JSON.stringify({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: "24yg3mrk2en4gaori4kw0btob",
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.AuthenticationResult) {
      console.error("Login failed ❌:", data);
      const message = data.message || "Login failed";
      throw new Error(message);
    }

    const { IdToken, AccessToken, RefreshToken } = data.AuthenticationResult;

    // トークンデコード & DB同期
    try {
      const decodedToken: any = jwtDecode(IdToken);
      const cognitoSub = decodedToken.sub;
      const email = decodedToken.email;

      await userService.updateCognitoSub(email, cognitoSub);
      console.log(`User ${email} linked with sub: ${cognitoSub}`);
    } catch (tokenError) {
      console.error("Token decoding or DB linking failed:", tokenError);
    }

    return {
      idToken: IdToken,
      accessToken: AccessToken,
      refreshToken: RefreshToken,
    };
  }

  async signUp(email: string, password: string, name: string): Promise<SignUpResult> {
    const attributes = [
      new CognitoUserAttribute({ Name: "email", Value: email }),
      new CognitoUserAttribute({ Name: "name", Value: name }), // name属性も送信
    ];
    console.log('HERE 1.1')

    return new Promise((resolve, reject) => {
      this.userPool.signUp(email, password, attributes, [], (err, result) => {
        if (err) {
          console.log('HERE1.2')
          console.log(err)

          reject(err);
          return;
        }
        // result.user, result.userConfirmed, result.codeDeliveryDetailsを含む
        resolve(result as SignUpResult);
      });
    });
  }

  async confirmSignUp(email: string, confirmationCode: string): Promise<void> {
    const cognitoUser = new CognitoUser({ Username: email, Pool: this.userPool });

    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        if (result === 'SUCCESS') {
          resolve();
        } else {
          // SUCCESS以外の結果（通常は発生しないが）
          reject(new Error("Confirmation failed with unexpected result: " + result));
        }
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
