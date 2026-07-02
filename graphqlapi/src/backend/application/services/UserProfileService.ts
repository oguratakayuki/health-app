import { IUserProfileService } from "@/backend/domain/interfaces/IUserProfileService";
import { UserProfile } from "@/backend/domain/entities/UserProfile";
import { ShowUserProfileDto } from "@/backend/application/dtos/ShowUserProfileDto";
import { IUserProfileRepository } from "@/backend/domain/interfaces/IUserProfileRepository";

export class UserProfileService implements IUserProfileService {
  constructor(
    private userProfileRepository: IUserProfileRepository,
  ) {}

  async getUserProfile(dto: ShowUserProfileDto): Promise<UserProfile | null> {
    try {
      const userId = parseInt(dto.userId);
      const profile = await this.userProfileRepository.findByUserId(userId);

      if (!profile) {
        throw new Error("UserProfileNotFound");
      }

      return profile;
    } catch (error) {
      if ((error as Error).message === "UserProfileNotFound") {
        throw new Error("対象のユーザープロフィールが存在しません。");
      }
      console.error("UserProfileService.getUserProfile error:", error);
      throw error;
    }
  }

  /**
   * 誕生日から現在の年齢を計算するビジネスロジック
   */
  calculateAge(birthday: Date | null): number | null {
    if (!birthday) return null;
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }
    return age;
  }
}
