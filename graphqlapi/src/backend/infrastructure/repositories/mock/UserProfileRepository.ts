import { IUserProfileRepository } from "@/backend/domain/interfaces/IUserProfileRepository";
import { UserProfile } from "@/backend/domain/entities/UserProfile";

export class MockUserProfileRepository implements IUserProfileRepository {
  private profiles: Map<number, UserProfile> = new Map();

  constructor() {
    // 初期データ
    this.profiles.set(1, {
      id: 1,
      userId: 100,
      gender: "Male",
      height: 175.5,
      birthday: new Date("1990-01-01"),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async findById(id: number): Promise<UserProfile | null> {
    return this.profiles.get(id) || null;
  }

  async findByUserId(userId: number): Promise<UserProfile | null> {
    const profile = Array.from(this.profiles.values()).find(p => p.userId === userId);
    return profile || null;
  }

  async save(profile: UserProfile): Promise<UserProfile> {
    this.profiles.set(profile.id, profile);
    return profile;
  }
}
