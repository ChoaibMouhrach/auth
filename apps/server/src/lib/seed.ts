import type { Database } from "@server/repos";
import { BASE_APPS } from "./apps-config";

const createApps = async (tx: Database, apps: typeof BASE_APPS) => {
  await tx.app.create(
    apps.map((app) => ({
      id: app.id,
      name: app.name,
    }))
  );

  await Promise.all([
    tx.appRedirectUrls.create(
      apps.map((app) => ({
        appId: app.id,
        url: app.redirectUrl,
      }))
    ),
    tx.appSecrets.create(
      apps.map((app) => ({
        appId: app.id,
        secret: app.secret,
      }))
    ),
  ]);
};

export const seed = (database: Database) => {
  return database.transaction(async (tx) => {
    console.log("- DATABASE SEEDING...");

    const [rawApps, redirectUrls] = await Promise.all([
      tx.app.find(),
      tx.appRedirectUrls.find(),
    ]);

    const apps = rawApps.map((app) => {
      return {
        app,
        redirectUrl: redirectUrls.find((url) => url.data.appId === app.data.id),
      };
    });

    const newApps = BASE_APPS.filter((app) => {
      return !apps.find(({ app: a }) => a.data.id === app.id);
    });

    // console.log({ newApps });

    // const appsToBeRemoved = apps.filter(({ app: currentApp }) => {
    // return !BASE_APPS.find((app) => app.id === currentApp.data.id);
    // });

    // console.log(appsToBeRemoved.map((app) => app.app.data));

    // const appsToBeUpdated = apps
    //   .map(({ app, ...rest }) => {
    //     const baseApp = BASE_APPS.find((baseApp) => {
    //       return baseApp.id === app.data.id;
    //     });

    //     if (!baseApp) {
    //       return null;
    //     }

    //     return {
    //       app,
    //       baseApp,
    //       ...rest,
    //     };
    //   })
    //   .filter((a) => a !== null)
    //   .filter((currentApp) => {
    //     if (!currentApp) return false;
    //     const { redirectUrl, baseApp, app } = currentApp;

    //     return (
    //       (!redirectUrl && baseApp.redirectUrl) ||
    //       (redirectUrl && baseApp.redirectUrl !== redirectUrl.data.url) ||
    //       baseApp.name !== app.data.name
    //     );
    //   });

    await createApps(tx, newApps);

    // ...appsToBeUpdated.map(async ({ app, baseApp, redirectUrl }) => {
    //   if (baseApp.name !== app.data.name) {
    //     app.data.name = baseApp.name;
    //     await app.save();
    //   }

    //   if (!redirectUrl) {
    //     await app.redirectUrls.createFirst({
    //       url: baseApp.redirectUrl,
    //     });
    //     return;
    //   }

    //   if (baseApp.redirectUrl === redirectUrl.data.url) {
    //     return;
    //   }

    //   redirectUrl.data.url = baseApp.redirectUrl;
    //   await redirectUrl.save();
    // }),
    // ]);

    console.log("- DATABASE SEEDED");
  });
};
