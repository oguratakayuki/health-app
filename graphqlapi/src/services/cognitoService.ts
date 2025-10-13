// graphqlapi/src/services/cognitoService.ts
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
import { getCognitoConfig } from "../config/cognito";

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
