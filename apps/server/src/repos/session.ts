import {
  sessionsTable,
  type TSession,
  type TSessionsTable,
} from "../database/schema";
import { NotFoundError } from "../lib/error";
import { BaseRepo, BaseRepoInstance } from "../lib/repo";
import { HTTP_ERROR_CODES } from "@auth/shared-constants";
import { AppMemberRepo } from "./app-member";

export class SessionInstance extends BaseRepoInstance<TSessionsTable> {
  public member;

  public constructor(options: { data: TSession; repo: SessionRepo }) {
    super(options);

    this.member = new AppMemberRepo(
      { dbClient: options.repo.dbClient },
      { id: options.data.memberId }
    );
  }
}

export class SessionRepo<
  T extends Partial<TSession> = Partial<TSession>
> extends BaseRepo<TSessionsTable, SessionInstance, T> {
  protected override table = sessionsTable;
  protected override notFoundError = new NotFoundError({
    code: HTTP_ERROR_CODES.SESSION_NOT_FOUND,
    message: "session not found",
  });

  public override mapInstance(rec: TSession): SessionInstance {
    return new SessionInstance({
      data: rec,
      repo: this,
    });
  }
}
