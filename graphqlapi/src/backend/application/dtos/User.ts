export interface CreateUserDto {
  email: string;
  name?: string | null;
  cognitoSub?: string;
}

export interface UpdateUserDto {
  name?: string | null;
  cognitoSub?: string | null;
  isAdmin?: boolean;
}
