import {
  CognitoUserPool
} from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
  ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
  endpoint: process.env.NEXT_PUBLIC_COGNITO_ENDPOINT,
};

export const userPool = new CognitoUserPool(poolData);
