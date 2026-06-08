// src/frontend/hooks/useMe.ts  (非推奨ラッパー)
import { useAuth } from "@frontend/auth/hooks/useAuth";

export const useMe = () => {
  const { user, loading, error, isAdmin, isLoggedIn } = useAuth();
  console.log("HERE");
  return {
    user,
    loading,
    error,
    isAdmin,
    isLoggedIn,
  };
};
