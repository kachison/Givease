export class InternalError extends Error implements Error {
  constructor(public error: any, public customMessage?: string) {
    let message =
      typeof error === "string"
        ? error
        : error instanceof InternalError
        ? error.message
        : customMessage || (error as Error).message;
    super(message);

    if (!(error instanceof InternalError) && typeof error !== "string") {
      console.log({
        error,
        timestamp: new Date(),
      });
    }
  }
}
