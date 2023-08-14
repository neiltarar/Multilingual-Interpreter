import { httpStatusCodes } from "./http-status-codes";
import { BaseError } from "./base-errors";

class Api500Error extends BaseError {
	constructor(
		name: any,
		statusCode = httpStatusCodes.INTERNAL_SERVER,
		description = "Server Error"
	) {
		super(name, statusCode, description);
	}
}
