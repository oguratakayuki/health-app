// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // レスポンス作成
    const res = NextResponse.json({ 
      success: true, 
      message: "ログアウト成功" 
    });
    // 全ての認証関連クッキーを削除
    res.cookies.delete("idToken");
    res.cookies.delete("accessToken");
    res.cookies.delete("refreshToken");
    // 開発環境ではセキュアフラグをオフにする場合があるので注意
    // 必要に応じてパスも指定
    // res.cookies.set("accessToken", "", { maxAge: -1, path: "/" });
    return res;
  } catch (error) {
    console.error("Error during logout:", error);
    // エラーが発生してもクッキーは削除する
    const res = NextResponse.json(
      { success: false, message: "ログアウト処理完了" },
      { status: 200 }
    );
    res.cookies.delete("idToken");
    res.cookies.delete("accessToken");
    res.cookies.delete("refreshToken");
    return res;
  }
}
