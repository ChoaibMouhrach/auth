import { rootRoute } from "./root";
import { SignInPage } from "@/pages/(auth)/sign-in/page";
import { SignUpPage } from "@/pages/(auth)/sign-up/page";
import { createRoute, Outlet } from "@tanstack/react-router";
import { ResetPasswordPage } from "@/pages/(auth)/reset-password/page";
import { RequestPasswordResetPage } from "@/pages/(auth)/request-password-reset/page";
import { appQuerySchema } from "@auth/shared-validations";
import { ConfirmEmailPage } from "@/pages/(auth)/confirm-email/page";
import z from "zod";

export const authLayout = createRoute({
  id: "auth-layout",
  component: () => <Outlet />,
  getParentRoute: () => rootRoute,
  validateSearch: appQuerySchema,
});

export const signInRoute = createRoute({
  path: "/sign-in",
  component: () => <SignInPage />,
  getParentRoute: () => authLayout,
});

export const signUpRoute = createRoute({
  path: "/sign-up",
  component: () => <SignUpPage />,
  getParentRoute: () => authLayout,
});

export const requestPasswordResetRoute = createRoute({
  path: "/request-password-reset",
  component: () => <RequestPasswordResetPage />,
  getParentRoute: () => authLayout,
});

export const resetPasswordRoute = createRoute({
  path: "/reset-password",
  component: () => <ResetPasswordPage />,
  getParentRoute: () => authLayout,
  validateSearch: appQuerySchema.extend({
    token: z.uuid(),
  }),
});

export const confirmEmailRoute = createRoute({
  path: "/confirm-email",
  component: () => <ConfirmEmailPage />,
  getParentRoute: () => authLayout,
});

export const authRouteTree = authLayout.addChildren([
  signInRoute,
  signUpRoute,
  confirmEmailRoute,
  resetPasswordRoute,
  requestPasswordResetRoute,
]);
