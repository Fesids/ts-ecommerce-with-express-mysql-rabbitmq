export class MissingParamError extends Error {
  constructor(paramName: string) {
    super(`Missing parameter "${paramName}" wasn't  provided`);
    this.name = "MissingParamError";
  }
}
