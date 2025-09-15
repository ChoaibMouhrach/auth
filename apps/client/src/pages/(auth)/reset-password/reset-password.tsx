import { api } from "@/api";
import { ExpectedError } from "@/api/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPasswordRoute } from "@/routes/auth";
import { resetPasswordSchema } from "@auth/shared-validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = resetPasswordSchema
  .extend({
    passwordConfirmation: z.string().min(8).max(60),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    error: "password ans password confirmation must match",
    path: ["passwordConfirmation"],
  });

type TSchemaOutput = z.output<typeof schema>;

export const ResetPassword = () => {
  const search = resetPasswordRoute.useSearch();

  const form = useForm({
    resolver: zodResolver(schema),
    values: {
      password: "",
      passwordConfirmation: "",
    },
  });

  const resetPassword = useMutation({
    mutationFn: (payload: TSchemaOutput) => {
      return api.auth.resetPassword({ json: payload, query: search });
    },
    onSuccess: (data) => {
      if (!data) return;
      const url = new URL(search.redirectUrl);

      url.searchParams.set("code", data.code);
      url.searchParams.set("redirectUrl", search.redirectUrl);
      url.searchParams.set("clientId", search.clientId);

      window.location.href = url.toString();
    },
    onError: (err) => {
      if (err instanceof ExpectedError) {
        toast.error(err.code);
        return;
      }

      toast.error(err.message);
    },
  });

  const onSubmit = (payload: TSchemaOutput) => {
    resetPassword.mutate(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} placeholder="********" type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="passwordConfirmation"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password confirmation</FormLabel>
              <FormControl>
                <Input {...field} placeholder="********" type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={resetPassword.isPending}>Reset password</Button>
      </form>
    </Form>
  );
};
