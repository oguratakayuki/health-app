import { BodyComposition } from "@/backend/domain/entities/BodyComposition";
import { ListBodyCompositionDto } from "@/backend/application/dtos/ListBodyCompositionDto";
import { ShowBodyCompositionDto } from "@/backend/application/dtos/ShowBodyCompositionDto";
import { EditBodyCompositionDto } from "@/backend/application/dtos/EditBodyCompositionDto";

export interface IBodyCompositionService {
  /**
   * 指定したユーザーの体組成計測履歴を一覧取得する
   */
  listBodyCompositions(dto: ListBodyCompositionDto): Promise<BodyComposition[]>;

  /**
   * 体組成計測データの詳細を取得する
   */
  showBodyComposition(dto: ShowBodyCompositionDto): Promise<BodyComposition | null>;

  /**
   * 体組成計測データを編集・更新する
   */
  editBodyComposition(dto: EditBodyCompositionDto): Promise<BodyComposition>;
}


