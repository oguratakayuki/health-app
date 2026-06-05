// src/frontend/auth/guards/AuthGuard.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CircularProgress, Box } from "@mui/material";
import { useAuth } from "../hooks/useAuth";

interface AuthGuardProps {
  children: ReactNode;
  fallbackPath?: string;
}

export function AuthGuard({
  children,
  fallbackPath = "/login",
}: AuthGuardProps) {
  const { isLoggedIn, loading } = useAuth();
  console.log(`isLoggedIn ${isLoggedIn}`);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push(fallbackPath);
    }
  }, [loading, isLoggedIn, router, fallbackPath]);

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

  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}
