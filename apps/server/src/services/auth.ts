import bcrypt from "bcryptjs";
import { AppError, UnauthorizedError } from "../lib/error";
import { BaseService } from "../lib/service";
import { HTTP_ERROR_CODES } from "@auth/shared-constants";
import { env } from "../lib/env";

export class AuthService extends BaseService {
  public signIn(payload: {
    email: string;
    password: string;
    clientId: string;
    redirectUrl: string;
  }) {
    return this.database.transaction(async (tx) => {
      const user = await tx.user.findFirstOrThrow({
        where: {
          field: {
            email: {
              eq: payload.email,
            },
          },
        },
      });

      const password = await user.passwords.findFirstOrThrow({});

      const isPasswordCorrect = await bcrypt.compare(
        payload.password,
        password.data.password
      );

      if (!isPasswordCorrect) {
        throw new AppError({
          code: HTTP_ERROR_CODES.PASSWORD_INCORRECT,
          message: "the password is not correct",
          statusCode: 409,
        });
      }

      const app = await tx.app.findFirstOrThrow({
        where: {
          field: {
            id: {
              eq: payload.clientId,
            },
          },
        },
      });

      // check redirect url
      await app.redirectUrls.findFirstOrThrow({
        where: {
          field: {
            url: {
              eq: payload.redirectUrl,
            },
          },
        },
      });

      let member = await app.members.findFirst({
        where: {
          field: {
            userId: {
              eq: user.data.id,
            },
          },
        },
      });

      if (!member) {
        member = await app.members.createFirst({
          userId: user.data.id,
        });
      }

      const code = await member.codes.createFirst({});

      return {
        code,
      };
    });
  }

  public async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  public signUp(payload: {
    email: string;
    password: string;
    clientId: string;
    redirectUrl: string;
  }) {
    return this.database.transaction(async (tx) => {
      const app = await tx.app.findFirstOrThrow({
        where: {
          field: {
            id: {
              eq: payload.clientId,
            },
          },
        },
      });

      await app.redirectUrls.findFirstOrThrow({
        where: {
          field: {
            url: {
              eq: payload.redirectUrl,
            },
          },
        },
      });

      let user = await tx.user.findFirst({
        where: {
          field: {
            email: {
              eq: payload.email,
            },
          },
        },
      });

      if (user) {
        throw new AppError({
          code: HTTP_ERROR_CODES.USER_ALREADY_EXISTS,
          message: "user already exists",
          statusCode: 409,
        });
      }

      user = await tx.user.createFirst({
        email: payload.email,
      });

      // attach app
      await user.member.createFirst({
        appId: app.data.id,
      });

      const hashedPassword = await this.hashPassword(payload.password);

      await user.passwords.createFirst({
        password: hashedPassword,
      });

      const token = await user.tokens.createFirst({
        type: "email-confirmation",
      });

      const url = new URL("/api/auth/confirm-email-address", env.VITE_API_URL);
      url.searchParams.set("token", token.data.token);
      url.searchParams.set("clientId", payload.clientId);
      url.searchParams.set("redirectUrl", payload.redirectUrl);

      await this.tools.mailer.sendMail({
        from: "auth",
        to: [user.data.email],
        subject: "Email confirmation",
        html: `<a href="${url.toString()}" >Confirm email</a>`,
      });
    });
  }

  public confirmEmail(payload: {
    token: string;
    clientId: string;
    redirectUrl: string;
  }) {
    return this.database.transaction(async (tx) => {
      const [token, app] = await Promise.all([
        tx.token.findFirst({
          where: {
            field: {
              token: {
                eq: payload.token,
              },
            },
          },
        }),

        tx.app.findFirst({
          where: {
            field: {
              id: {
                eq: payload.clientId,
              },
            },
          },
        }),
      ]);

      if (!app) {
        // TODO: try a redirect to an error page
        throw new Error("");
      }

      if (!token) {
        // TODO: try a redirect to an error page
        throw new Error("");
      }

      if (token.data.type !== "email-confirmation") {
        // TODO: try a redirect to an error page
        throw new Error("");
      }

      // remove token
      await token.remove();

      const redirectUrl = await app.redirectUrls.findFirst({
        where: {
          field: {
            url: {
              eq: payload.redirectUrl,
            },
          },
        },
      });

      if (!redirectUrl) {
        // TODO: try a redirect to an error page
        throw new Error("");
      }

      const user = await token.user.findFirstOrThrow();

      // attach user to app
      const member = await user.member.createFirst({
        appId: app.data.id,
      });

      const code = await member.codes.createFirst({});

      return {
        code,
      };
    });
  }

  public requestPasswordReset(payload: {
    email: string;
    clientId: string;
    redirectUrl: string;
  }) {
    return this.database.transaction(async (tx) => {
      const app = await tx.app.findFirstOrThrow({
        where: {
          field: {
            id: {
              eq: payload.clientId,
            },
          },
        },
      });

      await app.redirectUrls.findFirstOrThrow({
        where: {
          field: {
            url: {
              eq: payload.redirectUrl,
            },
          },
        },
      });

      const user = await tx.user.findFirstOrThrow({
        where: {
          field: {
            email: {
              eq: payload.email,
            },
          },
        },
      });

      const token = await user.tokens.createFirst({
        type: "request-password-reset",
      });

      const url = new URL("/reset-password", env.SERVER_CLIENT_URL);
      url.searchParams.set("token", token.data.token);
      url.searchParams.set("clientId", payload.clientId);
      url.searchParams.set("redirectUrl", payload.redirectUrl);

      await this.tools.mailer.sendMail({
        from: "auth",
        to: [user.data.email],
        subject: "Reset password",
        html: `<a href="${url.toString()}" >Reset password</a>`,
      });
    });
  }

  public resetPassword(payload: {
    token: string;
    password: string;
    clientId: string;
    redirectUrl: string;
  }) {
    return this.database.transaction(async (tx) => {
      const app = await tx.app.findFirstOrThrow({
        where: {
          field: {
            id: {
              eq: payload.clientId,
            },
          },
        },
      });

      await app.redirectUrls.findFirstOrThrow({
        where: {
          field: {
            url: {
              eq: payload.redirectUrl,
            },
          },
        },
      });

      const token = await tx.token.findFirstOrThrow({
        where: {
          field: {
            token: {
              eq: payload.token,
            },
          },
        },
      });

      if (token.data.type !== "request-password-reset") {
        throw new AppError({
          code: HTTP_ERROR_CODES.INCORRECT_TOKEN_TYPE,
          statusCode: 409,
          message: "invalid token type",
        });
      }

      const user = await token.user.findFirstOrThrow();

      await user.passwords.remove();
      const hashedPassword = await this.hashPassword(payload.password);
      await user.passwords.createFirst({ password: hashedPassword });

      const member = await app.members.findFirstOrThrow({
        where: {
          field: {
            userId: {
              eq: user.data.id,
            },
          },
        },
      });

      const code = await member.codes.createFirst({});

      return {
        code,
      };
    });
  }

  public getAuthUser(payload: { session: string }) {
    return this.database.transaction(async (tx) => {
      const session = await tx.session.findFirst({
        where: {
          field: {
            session: {
              eq: payload.session,
            },
          },
        },
      });

      if (!session) {
        throw new UnauthorizedError();
      }

      const member = await session.member.findFirstOrThrow();

      const user = await member.user.findFirstOrThrow();

      const app = await member.app.findFirstOrThrow();

      return {
        app,
        user,
        member,
        session,
      };
    });
  }

  public exchangeCode(payload: { code: string; secret: string }) {
    return this.database.transaction(async (tx) => {
      const code = await tx.codes.findFirstOrThrow({
        where: {
          field: {
            code: {
              eq: payload.code,
            },
          },
        },
      });

      const member = await code.member.findFirstOrThrow();

      const app = await member.app.findFirstOrThrow();

      await app.secrets.findFirstOrThrow({
        where: {
          field: {
            secret: {
              eq: payload.secret,
            },
          },
        },
      });

      await member.codes.remove({
        where: {
          field: {
            code: {
              eq: payload.code,
            },
          },
        },
      });

      const session = await member.sessions.createFirst({});

      return {
        session,
      };
    });
  }
}
