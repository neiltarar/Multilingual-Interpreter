export class BaseError extends Error {
  private statusCode: number;
  private description: any;
  private payload: any;

  constructor(name: string, statusCode: number, payload: any, description: any) {
    super(payload);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    this.payload = payload;
    this.description = description;
    Error.captureStackTrace(this);
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  getPayload(): any {
    return this.payload;
  }

  getDescription(): any {
    return {
      timestamp: new Date().toISOString(),
      name: this.name,
      statusCode: this.statusCode,
      payload: this.payload,
      description: this.description,
      stack: this.stack,
    };
  }
}
