import { IBodyCompositionService } from "@/backend/domain/interfaces/IBodyCompositionService";
import { BodyComposition } from "@/backend/domain/entities/BodyComposition";
import { ListBodyCompositionDto } from "@/backend/application/dtos/ListBodyCompositionDto";
import { IBodyCompositionRepository } from "@/backend/domain/interfaces/IBodyCompositionRepository";

export class BodyCompositionService implements IBodyCompositionService {
  constructor(
    private bodyCompositionRepository: IBodyCompositionRepository,
  ) {}

  async listBodyCompositions(dto: ListBodyCompositionDto): Promise<BodyComposition[]> {
    try {
      // 1. リポジトリからユーザーに紐づくデータを取得
      const results = await this.bodyCompositionRepository.findByUser(
        dto.userId, 
        dto.limit, 
        dto.offset
      );

      // 2. ビジネスロジック: 計測日時 (measuredAt) の降順でソート
      // ※ 本実装(Prisma)ではDB側でソートさせるが、ここではService層での担保を明示的に行う。
      return results.sort((a, b) => b.measuredAt.getTime() - a.measuredAt.getTime());
    } catch (error) {
      console.error("BodyCompositionService.listBodyCompositions error:", error);
      throw new Error("体組成計測履歴の取得に失敗しました。");
    }
  }
}
