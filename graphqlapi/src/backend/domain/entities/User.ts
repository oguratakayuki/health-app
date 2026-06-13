export interface User {
  id: string;
  email: string;
  name: string | null;
  cognitoSub: string | null;
  isAdmin: boolean;
  height: number | null;
  birthday: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
export interface CreateUserRepositoryInput {
  email: string;
  name?: string | null;
  cognitoSub: string;
}

export interface UpdateUserRepositoryInput {
  name?: string | null;
  cognitoSub?: string | null;
  isAdmin?: boolean;
}
