// src/frontend/auth/contexts/AuthContext.tsx
"use client";

import { createContext } from "react";
import { AuthContextValue } from "../types/auth.types";

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
