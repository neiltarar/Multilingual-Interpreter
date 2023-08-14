// Throw errors using this as base class
export class BaseError extends Error {
	private statusCode: number;
	private description: string;

	constructor(name: any, statusCode: any, description: any) {
		super(description);

		Object.setPrototypeOf(this, new.target.prototype);
		this.name = name;
		this.statusCode = statusCode;
		this.description = description;
		Error.captureStackTrace(this);
	}
}
