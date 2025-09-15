import { HTTP_ERROR_CODES } from "@auth/shared-constants";
import {
  codesTable,
  type TCode,
  type TCodesTable,
} from "@server/database/schema";
import { NotFoundError } from "@server/lib/error";
import { BaseRepo, BaseRepoInstance } from "@server/lib/repo";
import { AppMemberRepo } from "./app-member";

export class CodeInstance extends BaseRepoInstance<TCodesTable> {
  public member;

  public constructor(options: { data: TCode; repo: CodeRepo }) {
    super(options);

    this.member = new AppMemberRepo(
      { dbClient: options.repo.dbClient },
      { id: options.data.memberId }
    );
  }
}

export class CodeRepo<T extends Partial<TCode> = {}> extends BaseRepo<
  TCodesTable,
  CodeInstance,
  T
> {
  protected override table = codesTable;
  protected override notFoundError = new NotFoundError({
    code: HTTP_ERROR_CODES.CODE_NOT_FOUND,
    message: "code not found",
  });

  public override mapInstance(data: TCode): CodeInstance {
    return new CodeInstance({
      data,
      repo: this,
    });
  }
}
