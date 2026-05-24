// src/backend/application/auth/errors.ts
import { GraphQLError } from "graphql";

export class AuthenticationError extends GraphQLError {
  constructor(message: string = "Authentication required") {
    super(message, {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }
}

export class ForbiddenError extends GraphQLError {
  constructor(message: string = "Insufficient permissions") {
    super(message, {
      extensions: {
        code: "FORBIDDEN",
        http: { status: 403 },
      },
    });
  }
}
