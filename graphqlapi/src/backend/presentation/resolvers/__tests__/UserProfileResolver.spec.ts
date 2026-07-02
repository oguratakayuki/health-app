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

    const result = await resolver.userProfile(undefined, mockCtx);
    
    expect(mockService.getUserProfile).toHaveBeenCalled();
    expect(result?.id).toBe("1");
    expect(result?.gender).toBe("Male");
  });
});
