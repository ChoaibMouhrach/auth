import { HTTP_ERROR_CODES } from "@auth/shared-constants";
import { appsTable, type TApp, type TAppsTable } from "@server/database/schema";
import { NotFoundError } from "@server/lib/error";
import { BaseRepo, BaseRepoInstance } from "@server/lib/repo";
import { AppMemberRepo } from "./app-member";
import { AppRedirectUrlRepo } from "./app-redirect-url";
import { AppSecretRepo } from "./app-secrets";

export class AppInstance extends BaseRepoInstance<TAppsTable> {
  public members;
  public secrets;
  public redirectUrls;

  public constructor(options: { data: TApp; repo: AppRepo }) {
    super(options);

    this.members = new AppMemberRepo(
      { dbClient: options.repo.dbClient },
      { appId: options.data.id }
    );

    this.redirectUrls = new AppRedirectUrlRepo(
      { dbClient: options.repo.dbClient },
      { appId: options.data.id }
    );

    this.secrets = new AppSecretRepo(
      { dbClient: options.repo.dbClient },
      { appId: options.data.id }
    );
  }
}

export class AppRepo<T extends Partial<TApp> = {}> extends BaseRepo<
  TAppsTable,
  AppInstance,
  T
> {
  protected override table = appsTable;
  protected override notFoundError = new NotFoundError({
    code: HTTP_ERROR_CODES.APP_NOT_FOUND,
    message: "app not found",
  });

  public override mapInstance(data: TApp): AppInstance {
    return new AppInstance({
      data,
      repo: this,
    });
  }
}
