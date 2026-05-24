// app/(protected)/(admin)/layout.tsx
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getUserSession } from "@/backend/application/services/getUserSession";
import { AuthGuard } from "../../components/auth/AuthGuard";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await getUserSession();

  if (!user || !user.isAdmin) {
    notFound();
  }

  return (
    <AuthGuard requireAdmin>
      <div className="flex">
        <main className="flex-1 p-4">{children}</main>
      </div>
    </AuthGuard>
  );
}
