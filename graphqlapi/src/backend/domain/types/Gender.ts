// backend/domain/types/Gender.ts
export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
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
