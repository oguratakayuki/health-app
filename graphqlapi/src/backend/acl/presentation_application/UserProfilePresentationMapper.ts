import { UserProfile as UserProfileEntity } from "@/backend/domain/entities/UserProfile";
import { UserProfile as GraphQLUserProfile } from "@/backend/infrastructure/graphql/types/UserProfile";
import { ShowUserProfileDto } from "@/backend/application/dtos/ShowUserProfileDto";
import { EditUserProfileDto } from "@/backend/application/dtos/EditUserProfileDto";
import { ShowUserProfileInput } from "@/backend/infrastructure/graphql/inputs/ShowUserProfileInput";
import { EditUserProfileInput } from "@/backend/infrastructure/graphql/inputs/EditUserProfileInput";

export class UserProfilePresentationMapper {
  // 【上り】Presentation（GraphQL入力） ➔ Application（UseCase DTO）
  static toServiceDto(userId: string): ShowUserProfileDto {
    return {
      userId: parseInt(userId),
    };
  }

  static toEditServiceDto(input: EditUserProfileInput): EditUserProfileDto {
    return {
      id: input.id,
      gender: input.gender,
      height: input.height,
      birthday: input.birthday,
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
