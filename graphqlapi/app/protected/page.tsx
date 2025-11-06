"use client";

import { useEffect, useState } from "react";

export default function ProtectedPage() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const idToken = localStorage.getItem("idToken");

      if (!idToken) {
        setError("ログインしていません。");
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!res.ok) {
          const errData = await res.json();
          setError(`エラー: ${errData.error || res.statusText}`);
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } catch (e) {
        console.error(e);
        setError("通信エラーが発生しました。");
      }
    };

    fetchUser();
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!user) {
    return <p>読み込み中...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">保護されたページ</h1>
      <p>ユーザー名: {user.name || "（不明）"}</p>
      <p>Email: {user.email || "（不明）"}</p>
      <p>ユーザーID: {user.sub}</p>
    </div>
  );
}

