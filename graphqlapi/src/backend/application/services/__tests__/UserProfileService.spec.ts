import { describe, it, expect, beforeEach, vi } from "vitest";
import { UserProfileService } from "../UserProfileService";
import { ShowUserProfileDto } from "@/backend/application/dtos/ShowUserProfileDto";
import { IUserProfileRepository } from "@/backend/domain/interfaces/IUserProfileRepository";

describe("UserProfileService", () => {
  let service: UserProfileService;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = {
      findByUserId: vi.fn(),
      update: vi.fn(),
    };
    service = new UserProfileService(mockRepo);
  });

  it("should return user profile when it exists", async () => {
    const mockEntity = {
      id: 1,
      userId: 100,
      gender: "Male",
      height: 175.5,
      birthday: new Date("1990-01-01"),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockRepo.findByUserId.mockResolvedValue(mockEntity);

    const dto: ShowUserProfileDto = { userId: "100" };
    const result = await service.getUserProfile(dto);
    
    expect(result).toEqual(mockEntity);
  });

  it("should throw error when user profile does not exist", async () => {
    mockRepo.findByUserId.mockResolvedValue(null);

    const dto: ShowUserProfileDto = { userId: "999" };
    await expect(service.getUserProfile(dto)).rejects.toThrow("対象のユーザープロフィールが存在しません。");
  });

  it("should correctly calculate age", () => {
    const birthday = new Date("1990-01-01");
    const age = service.calculateAge(birthday);
    expect(age).toBeGreaterThanOrEqual(34); // 2024/2025年基準
  });

  it("should return mock profile when editUserProfile is called", async () => {
    const dto = {
      id: 1,
      gender: "Female",
      height: 165,
      birthday: "1995-01-01",
    };
    const mockEntity = {
      id: 1,
      userId: 100,
      gender: "Female",
      height: 165,
      birthday: new Date("1995-01-01"),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockRepo.update.mockResolvedValue(mockEntity);

    const result = await service.editUserProfile(dto);

    expect(result?.id).toBe(1);
    expect(result?.gender).toBe("Female");
  });
});
