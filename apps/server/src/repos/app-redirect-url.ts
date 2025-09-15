import { HTTP_ERROR_CODES } from "@auth/shared-constants";
import {
  appRedirectUrlsTable,
  type TAppRedirectUrl,
  type TAppRedirectUrlsTable,
} from "@server/database/schema";
import { NotFoundError } from "@server/lib/error";
import { BaseRepo, BaseRepoInstance } from "@server/lib/repo";
import { AppRepo } from "./app";

export class AppRedirectUrlInstance extends BaseRepoInstance<TAppRedirectUrlsTable> {
  public app;

  public constructor(options: {
    data: TAppRedirectUrl;
    repo: AppRedirectUrlRepo;
  }) {
    super(options);

    this.app = new AppRepo(
      { dbClient: options.repo.dbClient },
      { id: options.data.appId }
    );
  }
}

export class AppRedirectUrlRepo<
  T extends Partial<TAppRedirectUrl> = {}
> extends BaseRepo<TAppRedirectUrlsTable, AppRedirectUrlInstance, T> {
  protected override table = appRedirectUrlsTable;
  protected override notFoundError = new NotFoundError({
    code: HTTP_ERROR_CODES.APP_REDIRECT_URL_NOT_FOUND,
    message: "redirect url not found",
  });

  public override mapInstance(data: TAppRedirectUrl): AppRedirectUrlInstance {
    return new AppRedirectUrlInstance({
      data,
      repo: this,
    });
  }
}
