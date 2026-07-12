import "reflect-metadata";
import { BodyCompositionResolver } from "../BodyCompositionResolver";
import { GraphQLContext } from "@/backend/application/types/context";
import { vi } from "vitest";

describe("BodyCompositionResolver", () => {
  let resolver: BodyCompositionResolver;
  let mockCtx: Partial<GraphQLContext>;
  let mockService: any;

  beforeEach(() => {
    resolver = new BodyCompositionResolver();
    mockService = {
      listBodyCompositions: vi.fn().mockResolvedValue([
        {
          id: "1",
          userId: "user-123",
          weight: 70,
          bmi: 20,
          bodyFatPercentage: 15,
          skeletalMusclePercentage: 40,
          measuredAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any,
      ]),
    };
    mockCtx = {
      user: { id: "user-123" },
      bodyCompositionService: mockService as any,
    };
  });

  it("should call bodyCompositionService.listBodyCompositions and return mapped result", async () => {
    const result = await resolver.bodyCompositions(undefined, mockCtx as GraphQLContext);
    expect(mockService.listBodyCompositions).toHaveBeenCalled();
    expect(result.length).toBe(1);
    expect(result[0].weight).toBe(70);
  });

  it("should return a list of body compositions", async () => {
    const result = await resolver.bodyCompositions(undefined, mockCtx as GraphQLContext);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].userId).toBe("user-123");
  });
});
