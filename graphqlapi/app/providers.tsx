"use client";

import React from "react";
import { ApolloProvider } from "@apollo/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getApolloClient } from "../lib/apolloClient";
import { AuthProvider } from "@frontend/auth/providers/AuthProvider";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const client = getApolloClient();

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}
