"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "サインアップに失敗しました");
      }

      setMessage("サインアップに成功しました。確認コード入力ページへ移動します…");

      // ✅ /confirm ページへメールアドレス付きで遷移
      setTimeout(() => {
        router.push(`/confirm?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h1>サインアップ</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">名前:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="email">メールアドレス:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="password">パスワード:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" style={{ marginTop: 10 }}>サインアップ</button>
      </form>
      {message && <p style={{ color: "green", marginTop: 10 }}>{message}</p>}
      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
    </div>
  );
}


