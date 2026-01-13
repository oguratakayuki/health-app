"use client";

import { Mail, User, Shield, CheckCircle, User as UserIcon } from "lucide-react";

export default function UserInfo({ user }: { user: any }) {
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <h2 className="text-xl font-semibold text-red-600">
            ユーザー情報を取得できませんでした
          </h2>
        </div>
      </div>
    );
  }


  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* ヘッダーカード */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <UserIcon className="w-12 h-12 text-blue-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              ユーザー情報
            </h1>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-600">認証済みアカウント</span>
            </div>
            <p className="text-gray-600">
              このページはログインユーザーのみ閲覧できます。あなたのアカウント情報は安全に管理されています。
            </p>
          </div>
        </div>
      </div>

      {/* ユーザー情報カード */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">アカウント詳細</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {/* メールアドレス */}
          <div className="p-6">
            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900">メールアドレス</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                    認証済み
                  </span>
                </div>
                <p className="text-lg text-gray-800">{user.email}</p>
              </div>
            </div>
          </div>

          {/* ユーザーID */}
          <div className="p-6">
            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">ユーザーID (sub)</h3>
                <code className="text-sm font-mono text-gray-800 bg-gray-100 px-2 py-1 rounded">
                  {user.sub}
                </code>
              </div>
            </div>
          </div>

          {/* 発行者 */}
          <div className="p-6">
            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">発行者 (iss)</h3>
                <p className="text-sm text-gray-800 break-all">{user.iss}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 追加情報 */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-600 text-center">
          <span className="font-medium">最終更新:</span> {new Date().toLocaleDateString('ja-JP')}
        </p>
      </div>
    </div>
  );
}
