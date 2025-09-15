import { HTTP_ERROR_CODES } from "@auth/shared-constants";
import {
  appMembersTable,
  type TAppMember,
  type TAppMembersTable,
} from "@server/database/schema";
import { NotFoundError } from "@server/lib/error";
import { BaseRepo, BaseRepoInstance } from "@server/lib/repo";
import { CodeRepo } from "./codes";
import { SessionRepo } from "./session";
import { UserRepo } from "./user";
import { AppRepo } from "./app";

export class AppMemberInstance extends BaseRepoInstance<TAppMembersTable> {
  public codes;
  public sessions;
  public user;
  public app;

  public constructor(options: { data: TAppMember; repo: AppMemberRepo }) {
    super(options);

    this.sessions = new SessionRepo(
      { dbClient: options.repo.dbClient },
      { memberId: options.data.id }
    );

    this.codes = new CodeRepo(
      { dbClient: options.repo.dbClient },
      { memberId: options.data.id }
    );

    this.user = new UserRepo(
      { dbClient: options.repo.dbClient },
      { id: options.data.userId }
    );

    this.app = new AppRepo(
      { dbClient: options.repo.dbClient },
      { id: options.data.appId }
    );
  }
}

export class AppMemberRepo<T extends Partial<TAppMember> = {}> extends BaseRepo<
  TAppMembersTable,
  AppMemberInstance,
  T
> {
  protected override table = appMembersTable;
  protected override notFoundError = new NotFoundError({
    code: HTTP_ERROR_CODES.APP_MEMBER_NOT_FOUND,
    message: "member not found",
  });

  public override mapInstance(data: TAppMember): AppMemberInstance {
    return new AppMemberInstance({
      data,
      repo: this,
    });
  }
}
