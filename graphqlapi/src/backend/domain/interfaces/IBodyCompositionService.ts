import { BodyComposition } from "@/backend/domain/entities/BodyComposition";
import { ListBodyCompositionDto } from "@/backend/application/dtos/ListBodyCompositionDto";

export interface IBodyCompositionService {
  /**
   * 指定したユーザーの体組成計測履歴を一覧取得する
   */
  listBodyCompositions(dto: ListBodyCompositionDto): Promise<BodyComposition[]>;
}
