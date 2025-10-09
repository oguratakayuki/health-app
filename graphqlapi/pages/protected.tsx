// pages/protected.tsx
import { useEffect, useState } from "react";
import { CognitoUser, CognitoUserSession } from "amazon-cognito-identity-js";
import { userPool } from "../src/cognitoConfig";
import { useRouter } from "next/router";

export default function Protected() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const user = userPool.getCurrentUser();
    if (!user) {
      router.push("/login");
      return;
    }

    user.getSession((err, session) => {
      if (err || !session.isValid()) {
        router.push("/login");
      } else {
        user.getUserAttributes((err, attrs) => {
          if (!err && attrs) {
            const emailAttr = attrs.find((a) => a.getName() === "email");
            if (emailAttr) setEmail(emailAttr.getValue());
          }
        });
      }
    });
  }, []);

  const logout = () => {
    const user = userPool.getCurrentUser();
    if (user) {
      user.signOut();
      localStorage.removeItem("idToken");
    }
    router.push("/");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>保護されたページ</h1>
      <p>ようこそ {email} さん！</p>
      <button onClick={logout}>ログアウト</button>
    </div>
  );
}

