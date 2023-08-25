import { BaseError } from "./base-error";
import { httpStatusCodes } from "./http-status-codes";

export class BadRequestError extends BaseError {
  constructor(
    payload: any = "Bad request.",
    description: any = "The server could not understand the request.",
  ) {
    super("Bad Request", httpStatusCodes.BAD_REQUEST, payload, description);
  }
}

export class NotFoundError extends BaseError {
  constructor(
    payload: any = "Resource not found.",
    description: any = "The requested resource could not be found.",
  ) {
    super("Not Found", httpStatusCodes.NOT_FOUND, payload, description);
  }
}

export class ForbiddenError extends BaseError {
  constructor(
    payload: any = "You're not allowed to do this.",
    description: any = "This action is forbidden.",
  ) {
    super("Forbidden", httpStatusCodes.FORBIDDEN, payload, description); // 403
  }
}

export class MethodNotAllowedError extends BaseError {
  constructor(
    payload: any = "This method is not allowed.",
    description: any = "The HTTP method used is not supported for this resource.",
  ) {
    super(
      "Method Not Allowed",
      httpStatusCodes.METHOD_NOT_ALLOWED,
      payload,
      description,
    ); // 405
  }
}

export class UnauthorizedError extends BaseError {
  constructor(
    payload: any = "Unauthorized access.",
    description: any = "You are not authorized to access this resource.",
  ) {
    super("Unauthorized", httpStatusCodes.UNAUTHORIZED, payload, description);
  }
}

export class InvalidCredentialsError extends BaseError {
  constructor(
    payload: any = "Invalid login.",
    description: any = "The provided credentials are invalid.",
  ) {
    super(
      "Invalid Credentials",
      httpStatusCodes.UNAUTHORIZED,
      payload,
      description,
    );
  }
}

export class ConflictError extends BaseError {
  constructor(
    payload: any = "Conflict.",
    description: any = "The request could not be completed due to a conflict.",
  ) {
    super("Conflict", httpStatusCodes.CONFLICT, payload, description);
  }
}

export class ValidationError extends BaseError {
  constructor(
    payload: any = "Validation failed.",
    description: any = "The data provided failed validation.",
  ) {
    super(
      "Validation Error",
      httpStatusCodes.BAD_REQUEST,
      payload,
      description,
    ); // 400
  }
}

export class InvalidPromptError extends Error {
  constructor(
    message: string,
    public description: string,
  ) {
    super(message);
    this.name = "InvalidPromptError";
  }
}
