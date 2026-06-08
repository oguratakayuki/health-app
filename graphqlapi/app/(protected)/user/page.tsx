// app/(protected)/user/page.tsx
"use client";

import { useAuth } from "@/frontend/auth/hooks/useAuth";
import { CircularProgress, Box } from "@mui/material";
import UserInfo from "./user-info";

export default function UserPage() {
  const { user, loading, isLoggedIn } = useAuth();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isLoggedIn || !user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <p>ユーザー情報を取得できませんでした。</p>
      </Box>
    );
  }

  return <UserInfo user={user} />;
}
