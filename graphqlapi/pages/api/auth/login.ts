import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing username or password' });
  }

  try {
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

    if (!response.ok) {
      console.error('Login failed ❌:', data);
      return res.status(400).json({ message: 'Login failed', details: data });
    }
    if (!data.AuthenticationResult) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.status(200).json({
      idToken: data.AuthenticationResult.IdToken,
      accessToken: data.AuthenticationResult.AccessToken,
      refreshToken: data.AuthenticationResult.RefreshToken,
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

