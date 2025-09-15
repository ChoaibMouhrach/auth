import { AuthApi } from "./auth";

export class Api {
  public auth;

  public constructor() {
    this.auth = new AuthApi();
  }
}

export const api = new Api();
