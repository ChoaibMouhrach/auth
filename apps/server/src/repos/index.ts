import { UserRepo } from "./user";
import type { DbClient } from "../lib/drizzle";
import { PasswordRepo } from "./password";
import { SessionRepo } from "./session";
import { TokenRepo } from "./token";
import { AppRepo } from "./app";
import { AppRedirectUrlRepo } from "./app-redirect-url";
import { AppSecretRepo } from "./app-secrets";
import { CodeRepo } from "./codes";

export class Database {
  public dbClient;

  public user;
  public session;
  public password;
  public token;
  public app;
  public appRedirectUrls;
  public appSecrets;
  public codes;

  public constructor(context: { dbClient: DbClient }) {
    this.dbClient = context.dbClient;

    this.user = new UserRepo({
      dbClient: context.dbClient,
    });

    this.password = new PasswordRepo({
      dbClient: context.dbClient,
    });

    this.session = new SessionRepo({
      dbClient: context.dbClient,
    });

    this.token = new TokenRepo({
      dbClient: context.dbClient,
    });

    this.app = new AppRepo({
      dbClient: context.dbClient,
    });

    this.appRedirectUrls = new AppRedirectUrlRepo({
      dbClient: context.dbClient,
    });

    this.appSecrets = new AppSecretRepo({
      dbClient: context.dbClient,
    });

    this.codes = new CodeRepo({ dbClient: context.dbClient });
  }

  public transaction<CBR>(cb: (database: Database) => Promise<CBR>) {
    return this.dbClient.transaction((tx) => {
      return cb(new Database({ dbClient: tx }));
    });
  }
}
