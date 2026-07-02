import { InputType, Field } from "type-graphql";

@InputType()
export class ShowUserProfileInput {
  // ユーザーIDを指定して取得する場合。実際にはコンテキストから取得することが多いが、
  // インターフェース定義として保持する。
  @Field({ nullable: true })
  userId?: string;
}
