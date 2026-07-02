import { UserProfile } from "@/backend/domain/entities/UserProfile";

export interface IUserProfileRepository {
  findById(id: number): Promise<UserProfile | null>;
  findByUserId(userId: number): Promise<UserProfile | null>;
  save(profile: UserProfile): Promise<UserProfile>;
}
