"use client";

import React from "react";
import { ApolloProvider } from "@apollo/client";
import { createApolloClient } from "@/lib/apolloClient";

export default function AppApolloProvider({ children }: { children: React.ReactNode }) {
  const client = React.useMemo(() => createApolloClient(), []);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

