// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { jwtDecode } from 'jwt-decode'; // IDトークンのデコード用
import { userService } from '../../../src/services/userService'; // DB操作用
import { initializeDataSource } from '../../../src/data-source'; // TypeORM初期化用

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing username or password' });
  }

  try {
    await initializeDataSource();
  } catch (dbError) {
    console.error("Database initialization failed:", dbError);
    return res.status(500).json({ message: 'Server configuration error (DB init).' });
  }

  try {
    // 既存のCognito認証リクエスト
    const response = await fetch('http://cognito-local:9229/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-amz-json-1.1',
        'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
      },
      body: JSON.stringify({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: "24yg3mrk2en4gaori4kw0btob",
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.AuthenticationResult) {
      console.error('Login failed ❌:', data);
      const message = data.message || 'Login failed';
      return res.status(401).json({ message: message, details: data });
    }

    const { IdToken, AccessToken, RefreshToken } = data.AuthenticationResult;

    try {
      const decodedToken: any = jwtDecode(IdToken);
      const cognitoSub = decodedToken.sub;
      const email = decodedToken.email;

      await userService.updateCognitoSub(email, cognitoSub);
      console.log(`User ${email} linked with sub: ${cognitoSub}`);

    } catch (tokenError) {
        console.error('Token decoding or DB linking failed:', tokenError);
    }

    res.status(200).json({
      idToken: IdToken,
      accessToken: AccessToken,
      refreshToken: RefreshToken,
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
