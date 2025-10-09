// pages/login.tsx
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:9229/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-amz-json-1.1",
          "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth"
        },
        body: JSON.stringify({
          ClientId: "24yg3mrk2en4gaori4kw0btob",
          AuthFlow: "USER_PASSWORD_AUTH",
          AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
          },
        }),
      });

      const data = await response.json();

      if (data.AuthenticationResult) {
        setMessage("ログイン成功 ✅");
        console.log("ログイン成功:", data);
        // 取得できるトークン類：
        // data.AuthenticationResult.IdToken
        // data.AuthenticationResult.AccessToken
        // data.AuthenticationResult.RefreshToken
        localStorage.setItem("idToken", data.AuthenticationResult.IdToken);
      } else {
        setMessage("ログイン失敗 ❌: " + JSON.stringify(data));
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setMessage("通信エラー: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "3rem auto" }}>
      <h1>ログイン</h1>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "1rem" }}>
          <label>ユーザー名</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        <button type="submit">ログイン</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
