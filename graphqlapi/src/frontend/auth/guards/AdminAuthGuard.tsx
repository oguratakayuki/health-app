// src/frontend/auth/guards/AdminAuthGuard.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CircularProgress, Box } from "@mui/material";
import { useAdminAuth } from "@frontend/auth/hooks/useAdminAuth";

interface AdminAuthGuardProps {
  children: ReactNode;
  fallbackPath?: string;
  requireSuperAdmin?: boolean;
}

export function AdminAuthGuard({
  children,
  fallbackPath = "/not-found",
  requireSuperAdmin = false,
}: AdminAuthGuardProps) {
  const { isLoggedIn, isAdmin, isSuperAdmin, loading } = useAdminAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        router.push("/login");
      } else if (requireSuperAdmin && !isSuperAdmin) {
        router.push(fallbackPath);
      } else if (!isAdmin) {
        router.push(fallbackPath);
      }
    }
  }, [
    loading,
    isLoggedIn,
    isAdmin,
    isSuperAdmin,
    requireSuperAdmin,
    router,
    fallbackPath,
  ]);
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  if (!isLoggedIn || !isAdmin) {
    return null;
  }
  if (requireSuperAdmin && !isSuperAdmin) {
    return null;
  }
  return <>{children}</>;
}
