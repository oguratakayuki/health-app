// src/frontend/auth/services/AuthService.ts
import { ApolloClient } from "@apollo/client";

export class AuthService {
  constructor(private apolloClient: ApolloClient<object>) {}

  async signup(email: string, password: string, name: string): Promise<void> {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Signup failed");
    }
  }

  async login(email: string, password: string): Promise<void> {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
      credentials: "include", // クッキーを受け取るために必要
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    await this.apolloClient.resetStore();
  }

  async logout(): Promise<void> {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    await this.apolloClient.resetStore();
  }
}
