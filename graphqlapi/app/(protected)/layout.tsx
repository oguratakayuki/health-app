"use client";

import Sidebar from './_components/Sidebar';

export default function DashboardLayout({ 
  children,
}: { 
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* サイドバー */}
      <Sidebar />
      {/* メインコンテンツエリア */}
      <main className="flex-1 min-h-screen p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}
