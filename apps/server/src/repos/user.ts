import { PasswordRepo } from "./password";
import { NotFoundError } from "../lib/error";
import { BaseRepo, BaseRepoInstance } from "../lib/repo";
import { HTTP_ERROR_CODES } from "@auth/shared-constants";
import { usersTable, type TUser, type TUsersTable } from "../database/schema";
import { TokenRepo } from "./token";
import { AppMemberRepo } from "./app-member";

export class UserInstance extends BaseRepoInstance<TUsersTable> {
  public passwords;
  public tokens;
  public member;

  public constructor(options: { data: TUser; repo: UserRepo }) {
    super(options);

    this.passwords = new PasswordRepo(
      { dbClient: options.repo.dbClient },
      { userId: options.data.id }
    );

    this.tokens = new TokenRepo(
      { dbClient: options.repo.dbClient },
      { userId: options.data.id }
    );

    this.member = new AppMemberRepo(
      { dbClient: options.repo.dbClient },
      { userId: options.data.id }
    );
  }
}

export class UserRepo<T extends Partial<TUser> = {}> extends BaseRepo<
  TUsersTable,
  UserInstance,
  T
> {
  protected override table = usersTable;

  protected override notFoundError = new NotFoundError({
    code: HTTP_ERROR_CODES.USER_NOT_FOUND,
    message: "user not found",
  });

  public mapInstance(data: TUser): UserInstance {
    return new UserInstance({
      data,
      repo: this,
    });
  }
}
