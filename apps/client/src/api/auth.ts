import { apiClient } from "@/lib/hc";
import type { InferRequestType } from "hono";

export class ExpectedError extends Error {
  public code: string;
  public message: string;
  public statusCode: number;

  public constructor(payload: {
    code: string;
    message: string;
    statusCode: number;
  }) {
    super(payload.message);

    this.code = payload.code;
    this.message = payload.message;
    this.statusCode = payload.statusCode;
  }
}

export class UnexpectedError extends Error {
  public constructor() {
    super();
  }
}

// TODO: do error handling
export class AuthApi {
  public async signIn(payload: TSignInApiPayload) {
    try {
      const response = await signInApi(payload);

      if (!response.ok) {
        if (
          response.headers.get("content-type")?.includes("application/json") &&
          response.headers.get("content-length") != "0"
        ) {
          const data = await response.json();

          if (
            "statusCode" in data &&
            "code" in data &&
            "message" in data &&
            typeof data.statusCode === "number" &&
            typeof data.code === "string" &&
            typeof data.message === "string"
          ) {
            throw new ExpectedError({
              code: data.code,
              statusCode: data.statusCode,
              message: data.message,
            });
          }
        }

        throw new UnexpectedError();
      }

      if (
        response.headers.get("content-type")?.includes("application/json") &&
        response.headers.get("content-length") != "0"
      ) {
        return await response.json();
      }

      return;
    } catch {
      throw new UnexpectedError();
    }
  }

  public async signUp(payload: TSignUpApiPayload) {
    return signUpApi(payload);
  }

  public async requestPasswordReset(payload: TRequestPasswordResetApiPayload) {
    try {
      const response = await requestPasswordResetApi(payload);

      if (!response.ok) {
        if (
          response.headers.get("content-type")?.includes("application/json") &&
          response.headers.get("content-length") != "0"
        ) {
          const data = await response.json();

          if (
            data &&
            typeof data === "object" &&
            "statusCode" in data &&
            "code" in data &&
            "message" in data &&
            typeof data.statusCode === "number" &&
            typeof data.code === "string" &&
            typeof data.message === "string"
          ) {
            throw new ExpectedError({
              code: data.code,
              statusCode: data.statusCode,
              message: data.message,
            });
          }
        }

        throw new UnexpectedError();
      }

      if (
        response.headers.get("content-type")?.includes("application/json") &&
        response.headers.get("content-length") != "0"
      ) {
        return await response.json();
      }

      return;
    } catch (err) {
      if (err instanceof ExpectedError) {
        throw err;
      }

      throw new UnexpectedError();
    }
  }

  public async resetPassword(payload: TResetPasswordApiPayload) {
    try {
      const response = await resetPasswordApi(payload);

      if (!response.ok) {
        if (
          response.headers.get("content-type")?.includes("application/json") &&
          response.headers.get("content-length") != "0"
        ) {
          const data = await response.json();

          if (
            data &&
            typeof data === "object" &&
            "statusCode" in data &&
            "code" in data &&
            "message" in data &&
            typeof data.statusCode === "number" &&
            typeof data.code === "string" &&
            typeof data.message === "string"
          ) {
            throw new ExpectedError({
              code: data.code,
              statusCode: data.statusCode,
              message: data.message,
            });
          }
        }

        throw new UnexpectedError();
      }

      if (
        response.headers.get("content-type")?.includes("application/json") &&
        response.headers.get("content-length") != "0"
      ) {
        return await response.json();
      }

      return;
    } catch (err) {
      if (err instanceof ExpectedError) {
        throw err;
      }

      throw new UnexpectedError();
    }
  }
}

const signInApi = apiClient.api.auth["sign-in"].$post;
type TSignInApiPayload = InferRequestType<typeof signInApi>;

const signUpApi = apiClient.api.auth["sign-up"].$post;
type TSignUpApiPayload = InferRequestType<typeof signUpApi>;

const requestPasswordResetApi =
  apiClient.api.auth["request-password-reset"].$post;
type TRequestPasswordResetApiPayload = InferRequestType<
  typeof requestPasswordResetApi
>;

const resetPasswordApi = apiClient.api.auth["reset-password"].$post;
type TResetPasswordApiPayload = InferRequestType<typeof resetPasswordApi>;
