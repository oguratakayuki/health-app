import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import UserInfo from "./user-info";

export default async function ProtectedPage() {
  const cookieStore = cookies();
  const idToken = cookieStore.get("idToken");

  if (!idToken) {
    redirect("/login");
  }

  // SSR側で /api/auth/me を叩いて user 情報を取得
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${idToken.value}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/login");
  }

  const user = await res.json();

  // クライアント側コンポーネントに渡して表示
  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h1>保護されたページ</h1>
      <p>このページはログインユーザーのみ閲覧できます。</p>
      <hr style={{ margin: "1rem 0" }} />
      <UserInfo user={user.user} />
    </div>
  );
}
