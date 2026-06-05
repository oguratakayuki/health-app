// src/frontend/auth/providers/AdminAuthProvider.tsx
"use client";

import { ReactNode, useMemo, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { AdminAuthContext } from "../contexts/AdminAuthContext";
import { AdminAuthContextValue } from "../types/auth.types";

interface AdminAuthProviderProps {
  children: ReactNode;
  initialUser?: any; // Server Componentから渡される初期ユーザー
}

export function AdminAuthProvider({
  children,
  initialUser,
}: AdminAuthProviderProps) {
  const { user: clientUser, ...baseAuth } = useAuth();
  // Server Componentの初期値を優先しつつ、クライアント状態で上書き
  const user = clientUser || initialUser;
  const isLoggedIn = !!user;
  const isAdmin = user?.isAdmin === true;
  const elevatePrivileges = useCallback(async () => {
    // 権限昇格ロジック（例：MFA認証後）
    console.log("Elevating privileges...");
  }, []);
  const demotePrivileges = useCallback(async () => {
    // 権限降格ロジック
    console.log("Demoting privileges...");
  }, []);
  const value = useMemo<AdminAuthContextValue>(
    () => ({
      ...baseAuth,
      user: user || null,
      isLoggedIn,
      isAdmin,
      isSuperAdmin: isAdmin && user?.role === "SUPER_ADMIN",
      permissions: user?.permissions || [],
      elevatePrivileges,
      demotePrivileges,
    }),
    [baseAuth, user, isLoggedIn, isAdmin, elevatePrivileges, demotePrivileges],
  );
  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}
