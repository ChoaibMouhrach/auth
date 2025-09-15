export const HTTP_ERROR_CODES = {
  // USER
  USER_NOT_FOUND: "user-not-found",
  USER_ALREADY_EXISTS: "user-already-exists",

  // PASSWORD
  PASSWORD_NOT_FOUND: "password-not-found",
  PASSWORD_INCORRECT: "password-incorrect",

  // SESSION
  SESSION_NOT_FOUND: "session-not-found",

  // TOKEN
  TOKEN_NOT_FOUND: "token-not-found",
  INCORRECT_TOKEN_TYPE: "incorrect-token-type",

  // APP
  APP_NOT_FOUND: "app-not-found",

  // APP REDIRECT URL
  APP_REDIRECT_URL_NOT_FOUND: "app-redirect-url-not-found",

  // APP SECRET
  APP_SECRET_NOT_FOUND: "app-secret-not-found",

  // APP MEMBER
  APP_MEMBER_NOT_FOUND: "app-member-not-found",

  // CODE
  CODE_NOT_FOUND: "code-not-found",

  // UNAUTHORIZED
  UNAUTHORIZED: "unauthorized",

  // INTERNAL SERVER ERROR
  INTERNAL_SERVER_ERROR: "internal-server-error",
} as const;

export type HTTP_ERROR_CODES = typeof HTTP_ERROR_CODES;
export type HTTP_ERROR_CODES_KEYS = keyof HTTP_ERROR_CODES;
export type HTTP_ERROR_CODES_VALUES = HTTP_ERROR_CODES[HTTP_ERROR_CODES_KEYS];
