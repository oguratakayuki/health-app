// app/(protected)/(admin)/layout.tsx
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getUserSession } from "@/application/services/getUserSession";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await getUserSession();

  if (!user || !user.isAdmin) {
    notFound();
  }

  return (
    <div className="flex">
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}

