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
  id?: number; // 更新時は必須、作成時は自動採番
  userId: number;
  gender: string | null;
  height: number;
  birthday: Date | null;
}
