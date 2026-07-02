export interface UserProfile {
  id: number;
  userId: number;
  gender: string | null;
  height: number;
  birthday: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfileRepositoryInput {
  userId: number;
  gender: string | null;
  height: number;
  birthday: Date | null;
}
