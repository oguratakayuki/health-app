"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Key, CheckCircle, ArrowLeft } from "lucide-react";

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ signup から渡された email を自動セット
  useEffect(() => {
    const emailFromQuery = searchParams.get("email");
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "確認に失敗しました");
      }

      setMessage("確認が完了しました。ログインページへ移動します…");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* 確認コード入力フォームカード */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* ヘッダー */}
          <div className="flex flex-col items-center mb-6">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">確認コード入力</h1>
            <p className="text-gray-600 text-sm mt-2 text-center">
              メールアドレスに送信された確認コードを入力してください
            </p>
          </div>

          {/* 確認フォーム */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* メールアドレス入力（読み取り専用推奨） */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-gray-50"
                  placeholder="example@example.com"
                  readOnly={!!searchParams.get("email")}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                サインアップ時に使用したメールアドレス
              </p>
            </div>

            {/* 確認コード入力 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                確認コード
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="code"
                  name="code"
                  autoComplete="one-time-code"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-center tracking-widest"
                  placeholder="123456"
                  maxLength={6}
                  pattern="[0-9]{6}"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                6桁の数字で送信された確認コードを入力
              </p>
            </div>

            {/* 確認ボタン */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  確認中...
                </div>
              ) : (
                "確認する"
              )}
            </button>
          </form>

          {/* メッセージ表示 */}
          <div className="mt-4 space-y-2">
            {message && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                {message}
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* 注意事項 */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-xs text-blue-800 font-medium mb-1">
              💡 確認コードが見つからない場合:
            </p>
            <ul className="text-xs text-blue-700 space-y-0.5">
              <li>• メールの受信トレイと迷惑メールフォルダを確認</li>
              <li>• 数分待っても届かない場合はメールアドレスを確認</li>
            </ul>
          </div>

          {/* フッターリンク */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <button
              onClick={() => router.push("/signup")}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              サインアップ画面に戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
