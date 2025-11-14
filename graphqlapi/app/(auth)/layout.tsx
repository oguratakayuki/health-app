"use client";

import { ReactNode } from "react";
import { Box, Container, Paper, Typography } from "@mui/material";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.100",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          健康管理アプリ
        </Typography>
        <Box sx={{ mt: 2 }}>{children}</Box>
      </Paper>
    </Container>
  );
}

