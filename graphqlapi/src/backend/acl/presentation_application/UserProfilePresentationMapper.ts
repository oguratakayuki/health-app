import { UserProfile as UserProfileEntity } from "@/backend/domain/entities/UserProfile";
import { UserProfile as GraphQLUserProfile } from "@/backend/infrastructure/graphql/types/UserProfile";
import { ShowUserProfileDto } from "@/backend/application/dtos/ShowUserProfileDto";
import { ShowUserProfileInput } from "@/backend/infrastructure/graphql/inputs/ShowUserProfileInput";

export class UserProfilePresentationMapper {
  // 【上り】Presentation（GraphQL入力） ➔ Application（UseCase DTO）
  static toServiceDto(userId: string, input: ShowUserProfileInput): ShowUserProfileDto {
    return {
      userId: userId,
    };
  }

  // 【下り】Domain ➔ Presentation（GraphQL出力）
  static toGraphQLType(entity: UserProfileEntity): GraphQLUserProfile {
    return {
      id: entity.id.toString(),
      gender: entity.gender,
      height: entity.height,
      birthday: entity.birthday,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
