import { BodyComposition } from "@/backend/domain/entities/BodyComposition";
import { BodyComposition as GraphQLBodyComposition } from "@/backend/infrastructure/graphql/types/BodyComposition";

export class BodyCompositionPresentationMapper {
  /**
   * DomainEntity -> GraphQL Type 変換
   */
  static toGraphQLType(entity: BodyComposition): GraphQLBodyComposition {
    return {
      id: entity.id,
      userId: entity.userId,
      measuredAt: entity.measuredAt,
      weight: entity.weight,
      bmi: entity.bmi,
      bodyFatPercentage: entity.bodyFatPercentage,
      bodyFatMass: entity.bodyFatMass,
      subcutaneousFatPercentage: entity.subcutaneousFatPercentage,
      visceralFatLevel: entity.visceralFatLevel,
      skeletalMusclePercentage: entity.skeletalMusclePercentage,
      skeletalMuscleMass: entity.skeletalMuscleMass,
      ffmi: entity.ffmi,
      boneMass: entity.boneMass,
      basalMetabolism: entity.basalMetabolism,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  /**
   * DomainEntity List -> GraphQL Type List 変換
   */
  static toGraphQLTypeList(entities: BodyComposition[]): GraphQLBodyComposition[] {
    return entities.map((entity) => this.toGraphQLType(entity));
  }
}
