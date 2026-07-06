import "reflect-metadata";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { UserProfileResolver } from "../UserProfileResolver";
import type { GraphQLContext } from "@/backend/application/types/context";

describe("UserProfileResolver", () => {
  let resolver: UserProfileResolver;
  let mockService: any;
  let mockCtx: any;

  beforeEach(() => {
    resolver = new UserProfileResolver();
    mockService = {
      getUserProfile: vi.fn(),
      editUserProfile: vi.fn(),
    };
    mockCtx = {
      userProfileService: mockService,
      user: { id: "test-user" },
    };
  });

    it("should call service and return mapped profile", async () => {
    const mockEntity = {
      id: 1,
      userId: 100,
      gender: "Male",
      height: 175.5,
      birthday: new Date("1990-01-01"),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockService.getUserProfile.mockResolvedValue(mockEntity);

    const result = await resolver.userProfile(mockCtx, undefined);
    
    expect(mockService.getUserProfile).toHaveBeenCalled();
    expect(result?.id).toBe("1");
    expect(result?.gender).toBe("Male");
  });

  it("should return mock data for editUserProfile", async () => {
    const input = { id: 1, gender: "Female", height: 160, birthday: "1995-01-01" };
    const mockEntity = {
      id: 1,
      userId: 100,
      gender: "Female",
      height: 160,
      birthday: new Date("1995-01-01"),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockService.editUserProfile.mockResolvedValue(mockEntity);

    const result = await resolver.editUserProfile(mockCtx, input);
    
    expect(result?.id).toBe("1");
    expect(result?.gender).toBe("Female");
  });
}
);
