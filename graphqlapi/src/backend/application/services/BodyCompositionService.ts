import { IBodyCompositionService } from "@/backend/domain/interfaces/IBodyCompositionService";
import { BodyComposition } from "@/backend/domain/entities/BodyComposition";
import { ListBodyCompositionDto } from "@/backend/application/dtos/ListBodyCompositionDto";
import { ShowBodyCompositionDto } from "@/backend/application/dtos/ShowBodyCompositionDto";
import { EditBodyCompositionDto } from "@/backend/application/dtos/EditBodyCompositionDto";
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

  async editBodyComposition(dto: EditBodyCompositionDto): Promise<BodyComposition> {
    try {
      // 1. 対象のレコードが存在するか確認
      const existingEntity = await this.bodyCompositionRepository.findById(dto.id);

      if (!existingEntity) {
        throw new Error("BodyCompositionNotFound");
      }

      // 2. 認可チェック: 更新をリクエストしたユーザーが所有者であるか確認
      if (existingEntity.userId !== dto.userId) {
        throw new Error("Forbidden: You are not authorized to edit this record.");
      }

      // 3. リポジトリを呼び出して更新し、最新のエンティティを返却する
      const updatedEntity = await this.bodyCompositionRepository.update(dto.id, {
        weight: dto.weight,
        bmi: dto.bmi,
        bodyFatPercentage: dto.bodyFatPercentage,
        bodyFatMass: dto.bodyFatMass,
        skeletalMusclePercentage: dto.skeletalMusclePercentage,
        skeletalMuscleMass: dto.skeletalMuscleMass,
        subcutaneousFatPercentage: dto.subcutaneousFatPercentage,
        ffmi: dto.ffmi,
        boneMass: dto.boneMass,
        visceralFatLevel: dto.visceralFatLevel,
        basalMetabolism: dto.basalMetabolism,
        measuredAt: dto.measuredAt,
      });

      if (!updatedEntity) {
        throw new Error("Failed to update body composition");
      }

      return updatedEntity;
    } catch (error) {
      if ((error as Error).message === "BodyCompositionNotFound") {
        throw error;
      }
      console.error("BodyCompositionService.editBodyComposition error:", error);
      throw new Error(`体組成計測データの更新に失敗しました。${error instanceof Error ? error.message : ""}`);
    }
  }
}
