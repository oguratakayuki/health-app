// src/frontend/auth/contexts/AdminAuthContext.tsx
"use client";

import { createContext } from "react";
import { AdminAuthContextValue } from "../types/auth.types";

export const AdminAuthContext = createContext<
  AdminAuthContextValue | undefined
>(undefined);
