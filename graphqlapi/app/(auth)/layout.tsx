"use client";

import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-6 md:p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          健康管理アプリ
        </h2>
        <p className="text-gray-600 text-center text-sm mb-6">
          あなたの健康をサポートします
        </p>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
