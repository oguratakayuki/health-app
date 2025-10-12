import { useEffect, useState } from "react";

export default function ProtectedPage() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("idToken");
    if (!token) {
      setError("未ログインです");
      return;
    }

    fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "取得失敗");
        console.log(data.user)
        setUser(data.user);
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user) return <p>読み込み中...</p>;

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h1>認証済みページ</h1>
      <p>ユーザーID: {user.sub}</p>
      <p>名前: {user.name}</p>
      <p>メール: {user.email}</p>
      <p>発行者: {user.iss}</p>
      <p>発行時刻: {new Date(user.iat * 1000).toLocaleString()}</p>
      <p>有効期限: {new Date(user.exp * 1000).toLocaleString()}</p>
    </div>
  );
}
