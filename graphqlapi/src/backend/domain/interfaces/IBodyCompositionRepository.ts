import { BodyComposition } from "@/backend/domain/entities/BodyComposition";

export interface IBodyCompositionRepository {
  /**
   * 指定したユーザーの体組成計測履歴を取得する
   */
  findByUser(userId: string, limit?: number, offset?: number): Promise<BodyComposition[]>;
  
  /**
   * IDによる単一取得 (将来的な詳細表示/編集用)
   */
  findById(id: string): Promise<BodyComposition | null>;
}
