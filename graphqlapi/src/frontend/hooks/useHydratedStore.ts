import { useState, useEffect } from "react";

/**
 * Next.jsのSSR環境において、Zustandのpersist(LocalStorage同期)ストアを
 * ハイドレーションエラーを起こさずに安全に取得するためのカスタムフック
 * * @param useStore Zustandのストアフック
 * @param selector ストアから抽出するステートのセレクター関数
 * @param fallbackValue マウント(ハイドレーション)完了前に返す安全な初期値
 */
export function useHydratedStore<T, U>(
  useStore: (selector: (state: T) => U) => U,
  selector: (state: T) => U,
  fallbackValue: U,
): U {
  const [hydrated, setHydrated] = useState(false);
  const storeValue = useStore(selector);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // サーバーサイド・マウント前はfallbackValueを返し、ブラウザ同期完了後は実際のストアの値を返す
  return hydrated ? storeValue : fallbackValue;
}
