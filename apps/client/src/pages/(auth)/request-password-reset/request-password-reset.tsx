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
import { authLayout } from "@/routes/auth";
import { requestPasswordResetSchema } from "@auth/shared-validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";

const schema = requestPasswordResetSchema;
type TSchemaOutput = z.output<typeof schema>;

export const RequestPasswordReset = () => {
  const search = authLayout.useSearch();

  const form = useForm({
    resolver: zodResolver(schema),
    values: {
      email: "",
    },
  });

  const requestPasswordReset = useMutation({
    mutationFn: (payload: TSchemaOutput) => {
      return api.auth.requestPasswordReset({ json: payload, query: search });
    },
    onSuccess: () => {
      toast.success("check your email");
      form.reset();
    },
    onError: (err) => {
      console.log(err);

      if (err instanceof ExpectedError) {
        toast.error(err.code);
        return;
      }

      toast.error(err.message);
    },
  });

  const onSubmit = (payload: TSchemaOutput) => {
    return requestPasswordReset.mutate(payload);
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

        <Button disabled={requestPasswordReset.isPending}>Submit</Button>
      </form>
    </Form>
  );
};
