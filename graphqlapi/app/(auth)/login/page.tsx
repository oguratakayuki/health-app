"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "ログインに失敗しました");
      }

      setMessage("ログイン成功！保護ページへ移動します…");

      // ✅ 成功時に /protected へリダイレクト
      setTimeout(() => router.push("/protected"), 1000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h1>ログイン</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">username:</label>
          <input
            type="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">パスワード:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: 10 }}>
          ログイン
        </button>
      </form>

      {message && <p style={{ color: "green", marginTop: 10 }}>{message}</p>}
      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
    </div>
  );
}
