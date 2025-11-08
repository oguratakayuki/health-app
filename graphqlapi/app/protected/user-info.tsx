"use client";

export default function UserInfo({ user }: { user: any }) {
  if (!user) return <p>ユーザー情報を取得できませんでした。</p>;

  console.log(user)
  return (
    <div>
      <h2>ユーザー情報</h2>
      <ul>
        <li><strong>メールアドレス:</strong> {user.email}</li>
        <li><strong>ユーザーID (sub):</strong> {user.sub}</li>
        <li><strong>発行者 (iss):</strong> {user.iss}</li>
      </ul>
    </div>
  );
}

