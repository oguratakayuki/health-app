export interface User {
  id: string;
  email: string;
  name: string | null;
  cognitoSub: string | null;
  isAdmin: boolean;
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
