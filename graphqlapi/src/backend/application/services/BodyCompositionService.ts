import { IBodyCompositionService } from "@/backend/domain/interfaces/IBodyCompositionService";
import { BodyComposition } from "@/backend/domain/entities/BodyComposition";
import { ListBodyCompositionDto } from "@/backend/application/dtos/ListBodyCompositionDto";
import { ShowBodyCompositionDto } from "@/backend/application/dtos/ShowBodyCompositionDto";
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
      return results.sort((a, b) => b.measuredAt.getTime() - a.measuredAt.getTime());
    } catch (error) {
      console.error("BodyCompositionService.listBodyCompositions error:", error);
      throw new Error("体組成計測履歴の取得に失敗しました。");
    }
  }

  async showBodyComposition(dto: ShowBodyCompositionDto): Promise<BodyComposition | null> {
    try {
      // 1. リポジトリからIDでデータを取得
      const entity = await this.bodyCompositionRepository.findById(dto.id.toString());

      if (!entity) {
        throw new Error("BodyCompositionNotFound");
      }

      // 2. 認可チェック: ログインユーザー本人のデータであるか確認
      if (entity.userId !== dto.userId) {
        throw new Error("Forbidden: You are not authorized to access this record.");
      }

      return entity;
    } catch (error) {
      if ((error as Error).message === "BodyCompositionNotFound") {
        throw error;
      }
      console.error("BodyCompositionService.showBodyComposition error:", error);
      throw new Error("体組成計測データの取得に失敗しました。");
    }
  }
}
