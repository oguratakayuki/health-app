import { useQuery } from "@apollo/client";
import { ME_QUERY } from "@/frontend/graphql/queries/me";

export const useMe = () => {
  const { data, loading, error } = useQuery(ME_QUERY, {
    fetchPolicy: "cache-first",
  });

  return {
    user: data?.me ?? null,
    loading,
    error,
    isAdmin: data?.me?.isAdmin === true,
    isLoggedIn: !!data?.me,
  };
};
