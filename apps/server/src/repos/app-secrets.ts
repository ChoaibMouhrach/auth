import {
  appSecretsTable,
  type TAppSecret,
  type TAppSecretsTable,
} from "@server/database/schema";
import { AppRepo } from "./app";
import { NotFoundError } from "@server/lib/error";
import { HTTP_ERROR_CODES } from "@auth/shared-constants";
import { BaseRepo, BaseRepoInstance } from "@server/lib/repo";

export class AppSecretInstance extends BaseRepoInstance<TAppSecretsTable> {
  public app;

  public constructor(options: { data: TAppSecret; repo: AppSecretRepo }) {
    super(options);

    this.app = new AppRepo(
      { dbClient: options.repo.dbClient },
      { id: options.data.appId }
    );
  }
}

export class AppSecretRepo<
  TRelations extends Partial<TAppSecret> = {}
> extends BaseRepo<TAppSecretsTable, AppSecretInstance, TRelations> {
  protected override table = appSecretsTable;
  protected override notFoundError = new NotFoundError({
    code: HTTP_ERROR_CODES.APP_SECRET_NOT_FOUND,
    message: "secret not found",
  });

  public override mapInstance(data: TAppSecret): AppSecretInstance {
    return new AppSecretInstance({
      data,
      repo: this,
    });
  }
}
