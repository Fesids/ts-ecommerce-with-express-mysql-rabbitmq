export class MissingRequestParamError extends Error {
  constructor(paramName: string) {
    super(`Missing parameter "${paramName}"`);
    this.name = "MissingRequestParamError";
  }
}
