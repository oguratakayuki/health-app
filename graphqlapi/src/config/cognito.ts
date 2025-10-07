// graphqlapi/src/config/cognito.ts
export const cognitoConfig = {
  local: {
    endpoint: process.env.COGNITO_ENDPOINT || 'http://localhost:9229',
    userPoolId: process.env.COGNITO_USER_POOL_ID || 'ap-northeast-1_ABCDEFG12',
    clientId: process.env.COGNITO_CLIENT_ID || 'local-client-id',
    region: process.env.COGNITO_REGION || 'us-east-1',
  },
  production: {
    endpoint: process.env.COGNITO_ENDPOINT!,
    userPoolId: process.env.COGNITO_USER_POOL_ID!,
    clientId: process.env.COGNITO_CLIENT_ID!,
    region: process.env.COGNITO_REGION || 'us-east-1',
  }
};

export const getCognitoConfig = () => {
  return process.env.NODE_ENV === 'development' ? cognitoConfig.local : cognitoConfig.production;
};
