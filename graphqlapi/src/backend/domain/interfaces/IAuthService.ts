// src/domain/interfaces/IAuthService.ts
export interface IAuthService {
  signUp(email: string, password: string, name?: string): Promise<void>;
  signIn(email: string, password: string): Promise<{
    idToken: string;
    accessToken: string;
    refreshToken: string;
  }>;
  // 他の認証関連メソッド...
}
