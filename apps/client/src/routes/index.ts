import { authRouteTree } from "./auth";
import { rootRoute } from "./root";

export const routeTree = rootRoute.addChildren([authRouteTree]);
