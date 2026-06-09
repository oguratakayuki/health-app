// src/frontend/auth/providers/AuthProvider.tsx
"use client";

import { ReactNode, useEffect, useMemo, useCallback, useState } from "react";
import { useQuery, useApolloClient } from "@apollo/client";
import { ME_QUERY } from "@/frontend/graphql/queries/me";
import { AuthContext } from "../contexts/AuthContext";
import { AuthService } from "../services/AuthService";
import { AuthContextValue, AuthUser } from "../types/auth.types";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const apolloClient = useApolloClient();
  const [authService] = useState(() => new AuthService(apolloClient));
  const { data, loading, error, refetch } = useQuery(ME_QUERY, {
    fetchPolicy: "cache-first",
    errorPolicy: "ignore",
  });
  // デバッグログ
  useEffect(() => {
    console.log("AuthProvider state:", {
      hasData: !!data?.me,
      user: data?.me,
      loading,
      error: error?.message,
    });
  }, [data, loading, error]);

  const user = useMemo(() => data?.me as AuthUser | undefined, [data]);
  const isLoggedIn = useMemo(() => !!user, [user]);
  const isAdmin = useMemo(() => user?.isAdmin === true, [user]);
  const signup = useCallback(
    async (email: string, password: string, name: string) => {
      await authService.signup(email, password, name);
      // サインアップ後は自動ログインしない（確認コードが必要）
    },
    [authService],
  );
  const login = useCallback(
    async (email: string, password: string) => {
      await authService.login(email, password);
      await refetch();
    },
    [authService, refetch],
  );
  const logout = useCallback(async () => {
    console.log("🔴 logout called! Stack trace:", new Error().stack);
    await authService.logout();
    await refetch();
  }, [authService, refetch]);
  const refetchUser = useCallback(async () => {
    await refetch();
  }, [refetch]);
  const updateUser = useCallback(
    async (updatedUser: Partial<AuthUser>) => {
      // ユーザー更新ミューテーションを実行
      await refetch();
    },
    [refetch],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user || null,
      loading,
      error: error || null,
      isLoggedIn,
      isAdmin,
      signup,
      login,
      logout,
      refetchUser,
      updateUser,
    }),
    [
      user,
      loading,
      error,
      isLoggedIn,
      isAdmin,
      signup,
      login,
      logout,
      refetchUser,
      updateUser,
    ],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
