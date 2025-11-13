import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import UserInfo from "./user-info";
import DashboardLayout from '../DashboardLayout';

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
    <DashboardLayout>
      <UserInfo user={user.user} />
    </DashboardLayout>
  );
}
