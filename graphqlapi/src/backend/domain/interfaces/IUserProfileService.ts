import { UserProfile } from "@/backend/domain/entities/UserProfile";
import { ShowUserProfileDto } from "@/backend/application/dtos/ShowUserProfileDto";

export interface IUserProfileService {
  getUserProfile(dto: ShowUserProfileDto): Promise<UserProfile | null>;
}
