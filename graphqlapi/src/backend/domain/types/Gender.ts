// backend/domain/types/Gender.ts
export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

// DB都合（0/1）はInfrastructure責務
// DomainにDB表現を漏らさないためにinfra(repository)で呼んで変換する
export function toGenderDbValue(gender: Gender): number {
  switch (gender) {
    case Gender.Male:
      return 0;

    case Gender.Female:
      return 1;

    default:
      throw new Error(`Unsupported gender: ${gender}`);
  }
}
export function fromGenderDbValue(value: number): Gender {
  switch (value) {
    case 0:
      return Gender.Male;

    case 1:
      return Gender.Female;

    default:
      return Gender.Other;
  }
}
