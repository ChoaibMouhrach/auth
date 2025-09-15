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
import {
  signInSchema,
  type TSignInSchemaOutput,
} from "@auth/shared-validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import { toast } from "sonner";
import { authLayout } from "@/routes/auth";

const schema = signInSchema;
type TSchemaOutput = TSignInSchemaOutput;

export const SignIn = () => {
  const search = authLayout.useSearch();

  const form = useForm({
    resolver: zodResolver(schema),
    values: {
      email: "",
      password: "",
    },
  });

  const signIn = useMutation({
    mutationFn: async (payload: TSchemaOutput) => {
      const response = await api.auth.signIn({ json: payload, query: search });
      return response;
    },
    onSuccess: (data) => {
      const url = new URL(search.redirectUrl);
      url.searchParams.set("clientId", search.clientId);
      url.searchParams.set("redirectUrl", search.redirectUrl);
      url.searchParams.set("code", data.code.code);
      window.location.href = url.toString();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit = (payload: TSchemaOutput) => {
    signIn.mutate(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="example@example.com"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder="********" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={signIn.isPending}>
          {signIn.isPending ? "Sign in..." : "Sign in"}
        </Button>
      </form>
    </Form>
  );
};
