// src/presentation/resolvers/AuthResolver.ts
import { Resolver, Mutation, Arg, ObjectType, Field, Ctx } from "type-graphql";
import type { GraphQLContext } from '@/application/types/context';
import type { IUserService } from '@/domain/interfaces/IUserService';
import type { IAuthService } from '@/domain/interfaces/IAuthService';
import { User } from '@/infrastructure/graphql/types/User';
import { jwtDecode } from "jwt-decode";

interface CognitoIdTokenPayload {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  aud?: string;
  iss?: string;
  exp?: number;
  iat?: number;
}

@ObjectType()
class AuthResponse {
  @Field()
  success!: boolean;

  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  token?: string;

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class AuthResolver {
  /**
   * コンテキストからIAuthServiceを取得
   */
  private getAuthService(@Ctx() ctx: GraphQLContext): IAuthService {
    if (!ctx.authService) {
      throw new Error('AuthService is not available in context');
    }
    return ctx.authService;
  }

  /**
   * コンテキストからIUserServiceを取得
   */
  private getUserService(@Ctx() ctx: GraphQLContext): IUserService {
    if (!ctx.userService) {
      throw new Error('UserService is not available in context');
    }
    return ctx.userService;
  }

  @Mutation(() => AuthResponse)
  async signUp(
    @Ctx() ctx: GraphQLContext,
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("name", { nullable: true }) name?: string
  ): Promise<AuthResponse> {
    try {
      const authService = this.getAuthService(ctx);
      await authService.signUp(email, password, name);
      return {
        success: true,
        message: "ユーザー登録が完了しました。確認メールを確認してください。",
      };
    } catch (error: any) {
      console.error(`Error in signUp mutation: ${error}`);
      return {
        success: false,
        message: error.message || "登録に失敗しました",
      };
    }
  }

  @Mutation(() => AuthResponse)
  async signIn(
    @Ctx() ctx: GraphQLContext,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<AuthResponse> {
    try {
      const authService = this.getAuthService(ctx);
      const userService = this.getUserService(ctx);
      // Cognitoでサインイン
      const cognitoResult = await authService.signIn(email, password);
      const { idToken, accessToken, refreshToken } = cognitoResult;
      // トークンをデコードしてユーザー情報を取得
      const decoded = jwtDecode<CognitoIdTokenPayload>(idToken);
      const cognitoSub = decoded.sub;
      const userName = decoded.name || "NoName";
      // DBにユーザー情報を同期
      const user = await userService.syncUserByCognitoSub(
        cognitoSub, 
        email, 
        userName
      );
      // コンテキストにユーザー情報を設定
      ctx.user = user;

      return {
        success: true,
        message: "ログインに成功しました",
        token: idToken, // 必要に応じてトークンを返す
        user: user,
      };
    } catch (error: any) {
      console.error(`Error in signIn mutation: ${error}`);
      return {
        success: false,
        message: error.message || "ログインに失敗しました",
      };
    }
  }

  @Mutation(() => AuthResponse)
  async getCurrentUser(@Ctx() ctx: GraphQLContext): Promise<AuthResponse> {
    try {
      if (!ctx.user) {
        return {
          success: false,
          message: "認証されていません",
        };
      }

      // 必要に応じて最新のユーザー情報を取得
      const userService = this.getUserService(ctx);
      const currentUser = await userService.getUserById(ctx.user.id);

      return {
        success: true,
        user: currentUser,
      };
    } catch (error: any) {
      console.error(`Error in getCurrentUser mutation: ${error}`);
      return {
        success: false,
        message: "ユーザー情報の取得に失敗しました",
      };
    }
  }
}
