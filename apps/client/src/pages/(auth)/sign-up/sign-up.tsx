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
  signUpSchema,
  type TSignUpSchemaOutput,
} from "@auth/shared-validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import { toast } from "sonner";
import { authLayout } from "@/routes/auth";
import z from "zod";

const schema = signUpSchema
  .extend({
    passwordConfirmation: z.string().min(8).max(60),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    error: "password ans password confirmation must match",
    path: ["passwordConfirmation"],
  });

type TSchemaOutput = TSignUpSchemaOutput;

export const SignUp = () => {
  const search = authLayout.useSearch();
  const navigate = authLayout.useNavigate();

  const form = useForm({
    resolver: zodResolver(schema),
    values: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const signUp = useMutation({
    mutationFn: async (payload: TSchemaOutput) => {
      return await api.auth.signUp({
        json: payload,
        query: search,
      });
    },
    onSuccess: () => {
      navigate({ to: "/confirm-email", search });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit = (payload: TSchemaOutput) => {
    signUp.mutate(payload);
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

        <FormField
          name="passwordConfirmation"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password confirmation</FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder="********" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={signUp.isPending}>
          {signUp.isPending ? "Sign up..." : "Sign up"}
        </Button>
      </form>
    </Form>
  );
};
