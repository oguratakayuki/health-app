import { UserProfile } from "@/backend/domain/entities/UserProfile";
import { ShowUserProfileDto } from "@/backend/application/dtos/ShowUserProfileDto";
import { EditUserProfileDto } from "@/backend/application/dtos/EditUserProfileDto";

export interface IUserProfileService {
  getUserProfile(dto: ShowUserProfileDto): Promise<UserProfile | null>;
  editUserProfile(dto: EditUserProfileDto): Promise<UserProfile | null>;
}
