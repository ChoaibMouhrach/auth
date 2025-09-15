import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  type UpdateDeleteAction,
} from "drizzle-orm/pg-core";
import {
  relations,
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm";
import { id, timestamps } from "./utils";

export const usersTable = pgTable("users", {
  id: id(),

  // -- fields
  email: text().notNull().unique(),

  // -- timestamps
  confirmedAt: timestamp(),
  ...timestamps(),
});

const userId = (onDelete: UpdateDeleteAction = "cascade") => {
  return uuid()
    .notNull()
    .references(() => usersTable.id, { onDelete });
};

export type TUsersTable = typeof usersTable;
export type TUser = TUsersTable["$inferSelect"];
export type TUserInsert = TUsersTable["$inferInsert"];

export const userRelations = relations(usersTable, ({ many }) => ({
  passwords: many(passwordsTable),
  tokens: many(tokensTable),
  apps: many(appMembersTable),
}));

export const passwordsTable = pgTable("passwords", {
  id: id(),

  // -- fields
  password: text().notNull(),

  // -- references
  userId: userId(),

  // -- timestamps
  ...timestamps(),
});

export type TPasswordsTable = typeof passwordsTable;
export type TPassword = TPasswordsTable["$inferSelect"];
export type TPasswordInsert = TPasswordsTable["$inferInsert"];

export const passwordRelations = relations(passwordsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [passwordsTable.userId],
    references: [usersTable.id],
  }),
}));

export const tokenTypesEnum = pgEnum("tokenTypesEnum", [
  "email-confirmation",
  "request-password-reset",
]);

export const tokensTable = pgTable("tokens", {
  id: id(),

  // -- fields
  type: tokenTypesEnum().notNull(),
  token: uuid().notNull().defaultRandom(),

  // -- references
  userId: userId(),

  // -- timestamps
  ...timestamps(),
});

export type TTokensTable = typeof tokensTable;
export type TToken = TTokensTable["$inferSelect"];
export type TTokenInsert = TTokensTable["$inferInsert"];

export const tokenRelations = relations(tokensTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [tokensTable.userId],
    references: [usersTable.id],
  }),
}));

export const appsTable = pgTable("apps", {
  id: id(),

  // -- fields
  name: text().notNull(),

  // -- timestamps
  ...timestamps(),
});

export type TAppsTable = typeof appsTable;
export type TApp = InferSelectModel<TAppsTable>;
export type TAppInsert = InferInsertModel<TAppsTable>;

const appId = (onDelete: UpdateDeleteAction = "cascade") => {
  return uuid()
    .notNull()
    .references(() => appsTable.id, {
      onDelete,
    });
};

export const appRelations = relations(appsTable, ({ many }) => ({
  members: many(appMembersTable),
  secrets: many(appSecretsTable),
  redirectUrls: many(appRedirectUrlsTable),
}));

export const appSecretsTable = pgTable("appSecrets", {
  id: id(),

  // -- fields
  secret: uuid().notNull(),

  // -- references
  appId: appId(),

  // -- timestamps
  ...timestamps(),
});

export type TAppSecretsTable = typeof appSecretsTable;
export type TAppSecret = InferSelectModel<TAppSecretsTable>;
export type TAppSecretInsert = InferSelectModel<TAppSecretsTable>;

export const appSecretRelations = relations(appSecretsTable, ({ one }) => ({
  app: one(appsTable, {
    fields: [appSecretsTable.appId],
    references: [appsTable.id],
  }),
}));

export const appRedirectUrlsTable = pgTable("appRedirectUrls", {
  id: id(),

  // -- fields
  url: text().notNull().unique(),

  // -- references
  appId: appId(),

  // timestamps
  ...timestamps(),
});

export type TAppRedirectUrlsTable = typeof appRedirectUrlsTable;
export type TAppRedirectUrl = InferSelectModel<typeof appRedirectUrlsTable>;
export type TAppRedirectUrlInsert = InferInsertModel<
  typeof appRedirectUrlsTable
>;

export const appRedirectUrlRelations = relations(
  appRedirectUrlsTable,
  ({ one }) => ({
    app: one(appsTable, {
      fields: [appRedirectUrlsTable.appId],
      references: [appsTable.id],
    }),
  })
);

export const appMembersTable = pgTable("appMembers", {
  id: id(),

  // -- references
  appId: appId(),
  userId: userId(),

  // -- timestamps
  ...timestamps(),
});

export type TAppMembersTable = typeof appMembersTable;
export type TAppMember = InferSelectModel<TAppMembersTable>;
export type TAppMemberInsert = InferInsertModel<TAppMembersTable>;

const appMemberId = (onDelete: UpdateDeleteAction = "cascade") => {
  return uuid()
    .notNull()
    .references(() => appMembersTable.id, { onDelete });
};

export const appMemberRelations = relations(
  appMembersTable,
  ({ one, many }) => ({
    app: one(appsTable, {
      fields: [appMembersTable.appId],
      references: [appsTable.id],
    }),
    user: one(usersTable, {
      fields: [appMembersTable.userId],
      references: [usersTable.id],
    }),
    codes: many(codesTable),
  })
);

export const codesTable = pgTable("codes", {
  id: id(),

  // -- fields
  code: uuid().notNull().defaultRandom(),

  // -- references
  memberId: appMemberId(),

  // -- timestamps
  ...timestamps(),
});

export type TCodesTable = typeof codesTable;
export type TCode = InferSelectModel<TCodesTable>;
export type TCodeInsert = InferInsertModel<TCodesTable>;

export const codeRelations = relations(codesTable, ({ one }) => ({
  member: one(appMembersTable, {
    fields: [codesTable.memberId],
    references: [appMembersTable.id],
  }),
}));

export const sessionsTable = pgTable("sessions", {
  id: id(),

  // -- fields
  session: uuid().notNull().defaultRandom(),

  // -- references
  memberId: appMemberId(),

  // -- timestamps
  ...timestamps(),
});

export type TSessionsTable = typeof sessionsTable;
export type TSession = TSessionsTable["$inferSelect"];
export type TSessionInsert = TSessionsTable["$inferInsert"];

export const sessionRelations = relations(sessionsTable, ({ one }) => ({
  member: one(appMembersTable, {
    fields: [sessionsTable.memberId],
    references: [appMembersTable.id],
  }),
}));
