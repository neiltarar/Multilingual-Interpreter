import { BaseError } from "./base-error";
import { httpStatusCodes } from "./http-status-codes";

export class InternalServerError extends BaseError {
  constructor(
    payload: any = "An error occurred on the server.",
    description: any = "Internal Server Error."
  ) {
    super("Internal Server Error", httpStatusCodes.INTERNAL_SERVER, payload, description);
  }
}

export class NotImplementedError extends BaseError {
  constructor(
    payload: any = "This functionality is not implemented.",
    description: any = "This feature or operation has not yet been implemented."
  ) {
    super("Not Implemented", httpStatusCodes.NOT_IMPLEMENTED, payload, description); // 501
  }
}
