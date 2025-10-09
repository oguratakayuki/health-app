// pages/signup.tsx
import { useState } from "react";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { userPool } from "../src/cognitoConfig";
import { useRouter } from "next/router";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignUp = () => {
    const attributeList = [new CognitoUserAttribute({ Name: "email", Value: email })];

    userPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }
      alert("確認コードをメールで送信しました。");
      router.push("/login");
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>サインアップ</h1>
      <input placeholder="メール" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="パスワード" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignUp}>登録</button>
    </div>
  );
}

