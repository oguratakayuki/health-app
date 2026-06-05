// src/frontend/auth/types/auth.types.ts
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  cognitoSub?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: Error | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
}

export interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
  updateUser: (user: Partial<AuthUser>) => Promise<void>;
}

export interface AdminAuthContextValue extends AuthContextValue {
  isSuperAdmin: boolean;
  permissions: string[];
  elevatePrivileges: () => Promise<void>;
  demotePrivileges: () => Promise<void>;
}
