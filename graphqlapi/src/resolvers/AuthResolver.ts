// graphqlapi/src/resolvers/AuthResolver.ts
import { Resolver, Mutation, Arg, ObjectType, Field, Ctx } from "type-graphql";
import type { GraphQLContext } from "../context";
import { cognitoService } from "../services/cognitoService";
import { User } from '../entities/User';
import { jwtDecode } from "jwt-decode";
import { userService } from '../../src/services/userService'; // DB操作用

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

  @Field(() => User)
  user!: User;
}

@Resolver()
export class AuthResolver {
  @Mutation(() => AuthResponse)
  async signUp(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("name", { nullable: true }) name?: string
  ): Promise<AuthResponse> {
    try {
      await cognitoService.signUp(email, password, { name });
      return {
        success: true,
        message: "ユーザー登録が完了しました。確認メールを確認してください。",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "登録に失敗しました",
      };
    }
  }

  @Mutation(() => AuthResponse)
  async signIn(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: GraphQLContext
  ): Promise<AuthResponse> {
    try {
      const cognitoUser = await cognitoService.signIn(email, password);
      const { idToken, accessToken, refreshToken } = await cognitoService.signIn2(email, password);
      const decoded = jwtDecode<CognitoIdTokenPayload>(idToken);
      const cognitoSub = decoded.sub;
      const name = decoded.name || "NoName";
      const user = await userService.syncUserByCognitoSub(cognitoSub, email, name);
      console.log('HERE')
      console.log(user)

      // セッションにユーザー情報を保存(GraphQLのコンテキストに保存)
      ctx.user = user;

      return {
        success: true,
        message: "ログインに成功しました",
        user: user,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "ログインに失敗しました",
      };
    }
  }

  @Mutation(() => AuthResponse)
  async signOut(@Ctx() ctx: GraphQLContext): Promise<AuthResponse> {
    try {
      await cognitoService.signOut();
      ctx.user = null;

      return {
        success: true,
        message: "ログアウトしました",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "ログアウトに失敗しました",
      };
    }
  }

  @Mutation(() => AuthResponse)
  async getCurrentUser(@Ctx() ctx: GraphQLContext): Promise<AuthResponse> {
    if (!ctx.user) {
      return {
        success: false,
        message: "認証されていません",
      };
    }

    return {
      success: true,
      user: ctx.user,
    };
  }
}
