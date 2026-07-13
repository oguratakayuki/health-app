import { BodyCompositionService } from "../BodyCompositionService";
import { ListBodyCompositionDto } from "@/backend/application/dtos/ListBodyCompositionDto";
import { IBodyCompositionRepository } from "@/backend/domain/interfaces/IBodyCompositionRepository";
import { vi } from "vitest";

describe("BodyCompositionService", () => {
  let service: BodyCompositionService;
  let mockRepo: IBodyCompositionRepository;

  beforeEach(() => {
    mockRepo = {
      findByUser: vi.fn().mockResolvedValue([
        {
          id: "1",
          userId: "user-123",
          weight: 70,
          bmi: 20,
          bodyFatPercentage: 15,
          measuredAt: new Date(2023, 0, 1),
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any,
        {
          id: "2",
          userId: "user-123",
          weight: 71,
          bmi: 21,
          bodyFatPercentage: 16,
          measuredAt: new Date(2023, 0, 2),
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any,
      ]),
      findById: vi.fn().mockResolvedValue({
        id: "1",
        userId: "user-123",
        weight: 70.5,
        bmi: 22.1,
        bodyFatPercentage: 18.5,
        measuredAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any),
    };
    service = new BodyCompositionService(mockRepo);
  });

    it("should return a list of body compositions sorted by measuredAt descending", async () => {
    const dto: ListBodyCompositionDto = { userId: "user-123" };
    const result = await service.listBodyCompositions(dto);
    
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    // 降順ソート確認 (2023-01-02 が先に来るべき)
    expect(result[0].id).toBe("2");
    expect(result[1].id).toBe("1");
  });

  it("should return a mock body composition for showBodyComposition", async () => {
    const dto: ShowBodyCompositionDto = { id: 1, userId: "user-123" };
    const result = await service.showBodyComposition(dto);

    expect(result).not.toBeNull();
    expect(result?.id).toBe("1");
    expect(result?.weight).toBe(70.5);
  });
}
);
