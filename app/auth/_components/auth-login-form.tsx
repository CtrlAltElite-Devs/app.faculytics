"use client";

import type { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/features/auth/hooks/use-login";
import { loginRequestSchema } from "@/features/auth/schemas";
import type { AuthErrorResponse, LoginRequest } from "@/features/auth/types";

type AuthLoginFormProps = {
  isAuthenticating: boolean;
  statusMessage?: string | null;
};

export function AuthLoginForm({ isAuthenticating, statusMessage }: AuthLoginFormProps) {
  const { mutate, isPending, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginRequestSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const isBusy = isPending || isAuthenticating;
  const loginErrorMessage =
    (error as AxiosError<AuthErrorResponse> | null)?.response?.data?.message ?? null;
  const feedbackMessage = loginErrorMessage ?? statusMessage;

  const onSubmit = (values: LoginRequest) => {
    mutate({ password: values.password, username: values.username });
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h2 className="font-playfair text-3xl font-bold">Welcome</h2>
        <p className="mt-2 text-sm">Sign in using your student portal account</p>
      </div>

      {feedbackMessage ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-center text-sm text-destructive">
          {feedbackMessage}
        </div>
      ) : null}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FieldGroup>
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  {...field}
                  id="username"
                  type="text"
                  placeholder="john@gmail.com"
                  disabled={isBusy}
                />
                {fieldState.error ? <FieldError>{fieldState.error.message}</FieldError> : null}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <div className="flex justify-between">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <FieldLabel className="cursor-pointer">Forgot Password?</FieldLabel>
                </div>
                <div className="relative">
                  <Input
                    {...field}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pr-10"
                    disabled={isBusy}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute top-1/2 right-1 -translate-y-1/2"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={isBusy}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                </div>
                {fieldState.error ? <FieldError>{fieldState.error.message}</FieldError> : null}
              </Field>
            )}
          />
        </FieldGroup>

        <Button
          type="submit"
          variant="brand"
          disabled={isBusy}
          className="w-full font-semibold text-secondary"
        >
          {isBusy ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>

      <div className="flex justify-center gap-2 text-sm">
        <p className="text-muted-foreground">Need an account?</p>
        <a className="cursor-pointer">Contact your administrator</a>
      </div>
    </div>
  );
}
