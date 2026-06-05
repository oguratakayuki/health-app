// app/(protected)/(admin)/layout.tsx
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getUserSession } from "@/backend/application/services/getUserSession";
import { AdminAuthGuard } from "@/frontend/auth/guards/AdminAuthGuard";
import { AdminAuthProvider } from "@/frontend/auth/providers/AdminAuthProvider";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Layout-Level Authentication Pattern (Server Component)
  const user = await getUserSession();

  if (!user || !user.isAdmin) {
    notFound();
  }

  // React Provider Pattern (Client Component)
  return (
    <AdminAuthProvider initialUser={user}>
      <AdminAuthGuard>
        <div className="flex">
          <main className="flex-1 p-4">{children}</main>
        </div>
      </AdminAuthGuard>
    </AdminAuthProvider>
  );
}
