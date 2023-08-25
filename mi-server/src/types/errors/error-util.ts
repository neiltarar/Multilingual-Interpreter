import { Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  ConflictError,
  ForbiddenError,
  MethodNotAllowedError,
  ValidationError,
  UnauthorizedError,
  InvalidCredentialsError,
} from "./400-errors";
import { NotImplementedError } from "./500-errors";
import { httpStatusCodes } from "./http-status-codes";
import { BaseError } from "./base-error";

export const controllerErrorHandler = (e: Error, res: Response) => {
  if (e instanceof BaseError) {
    const error = e as BaseError;

    let statusCode = httpStatusCodes.INTERNAL_SERVER; // Default to 500
    let logMessage = "API 500 - Internal Server Error caught:";

    if (e instanceof BadRequestError || e instanceof ValidationError) {
      statusCode = httpStatusCodes.BAD_REQUEST;
      logMessage = `API ${statusCode} - ${error.name} caught:`;
    } else if (e instanceof UnauthorizedError || e instanceof InvalidCredentialsError) {
      statusCode = httpStatusCodes.UNAUTHORIZED;
      logMessage = `API ${statusCode} - ${error.name} caught:`;
    } else if (e instanceof ForbiddenError) {
      statusCode = httpStatusCodes.FORBIDDEN;
      logMessage = `API ${statusCode} - ${error.name} caught:`;
    } else if (e instanceof NotFoundError) {
      statusCode = httpStatusCodes.NOT_FOUND;
      logMessage = `API ${statusCode} - ${error.name} caught:`;
    } else if (e instanceof MethodNotAllowedError) {
      statusCode = httpStatusCodes.METHOD_NOT_ALLOWED;
      logMessage = `API ${statusCode} - ${error.name} caught:`;
    } else if (e instanceof ConflictError) {
      statusCode = httpStatusCodes.CONFLICT;
      logMessage = `API ${statusCode} - ${error.name} caught:`;
    } else if (e instanceof NotImplementedError) {
      statusCode = httpStatusCodes.NOT_IMPLEMENTED;
      logMessage = `API ${statusCode} - ${error.name} caught:`;
    }

    console.log(logMessage, error.getDescription());
    res.status(statusCode).send(error.getPayload());
  } else {
    // Handle generic errors
    console.log("Unexpected Error caught:", e);
    res.status(httpStatusCodes.INTERNAL_SERVER).send("An unexpected error occurred");
  }
};
