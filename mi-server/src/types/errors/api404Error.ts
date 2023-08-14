import { httpStatusCodes } from "./http-status-codes";
import { BaseError } from "./base-errors";

export class Api404Error extends BaseError {
	constructor(
		name: any,
		statusCode = httpStatusCodes.NOT_FOUND,
		description = "Not found."
	) {
		super(name, statusCode, description);
	}
}
