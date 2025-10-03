// graphqlapi/src/config/cognito.ts
export const cognitoConfig = {
  local: {
    endpoint: process.env.COGNITO_ENDPOINT || 'http://localhost:9229',
    userPoolId: process.env.COGNITO_USER_POOL_ID || 'local-user-pool-id',
    clientId: process.env.COGNITO_CLIENT_ID || 'local-client-id',
    region: process.env.COGNITO_REGION || 'us-east-1',
  },
  production: {
    userPoolId: process.env.COGNITO_USER_POOL_ID!,
    clientId: process.env.COGNITO_CLIENT_ID!,
    region: process.env.COGNITO_REGION || 'us-east-1',
  }
};

export const getCognitoConfig = () => {
  return process.env.NODE_ENV === 'development' ? cognitoConfig.local : cognitoConfig.production;
};
