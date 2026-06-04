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

export interface CreateUserInput {
  email: string;
  name?: string | null;
  cognitoSub?: string;
}

export interface UpdateUserInput {
  name?: string | null;
  cognitoSub?: string | null;
  isAdmin?: boolean;
}
