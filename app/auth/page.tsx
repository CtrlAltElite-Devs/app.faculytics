"use client";

import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useActiveRole } from "@/hooks/auth/use-active-role";
import { useLogin } from "@/hooks/auth/use-login";
import { useMe } from "@/hooks/auth/use-me";
import { loginRequestSchema } from "@/schemas/auth";
import { useAuthStore } from "@/stores/auth-store";
import { LoginRequest } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function AuthPage() {
  const router = useRouter();
  const { mutate, isPending } = useLogin();
  const { data: me, isPending: isMePending, isError: isMeError } = useMe();
  const { roleHome } = useActiveRole();
  const clearSession = useAuthStore((state) => state.clearSession);
  const token = useAuthStore((state) => state.token);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginRequestSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  const onSubmit = (values: LoginRequest) => {
    mutate({password: values.password, username: values.username})
  };

  useEffect(() => {
    if (!token || isMePending) return;

    if (isMeError) {
      clearSession();
      return;
    }

    if (roleHome) {
      router.replace(roleHome);
      return;
    }

    if (me) {
      clearSession();
    }
  }, [clearSession, isMeError, isMePending, me, roleHome, router, token]);

  if (token && isMePending) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Redirecting...
      </div>
    );
  }

  return (
    <div className="h-screen grid grid-cols-1 lg:grid-cols-10">

      {/* Hero Section */}
      <div className="relative overflow-hidden hidden lg:block lg:col-span-7">
        <BackgroundGradientAnimation
          gradientBackgroundStart="rgb(44, 58, 208)"
          gradientBackgroundEnd="rgb(30, 40, 150)"
          firstColor="60, 100, 255"
          secondColor="80, 130, 255"
          thirdColor="40, 80, 220"
          fourthColor="0, 0, 0, 0"
          fifthColor="0, 0, 0, 0"
          pointerColor="60, 100, 255"
          size="50%"
          containerClassName="h-full w-full"
        >
          <div className="absolute z-50 inset-0 flex flex-col justify-end p-16 text-white pointer-events-none">
            <div className="space-y-6 mb-16">
              <h1 className="text-5xl font-playfair font-semibold leading-tight">
                Data-driven decisions for better education
              </h1>
              <p className="text-xl opacity-90 font-medium max-w-lg">
                Powered by artificial intelligence to deliver real-time insights and smart recommendations.
              </p>
            </div>
            <div className="text-sm opacity-70">
              2026 Faculytics. All rights reserved.
            </div>
          </div>
        </BackgroundGradientAnimation>
      </div>

      {/* Form Section */}
      <div className="flex flex-col col-span-1 lg:col-span-3">
        <div className="flex items-center justify-between p-4 sm:p-6 lg:p-8">
          <h3 className="text-xl font-playfair font-semibold">Faculytics 2.0</h3>
          <ThemeToggle />
        </div>

        <div className="flex grow items-center justify-center px-6 sm:px-10 lg:px-12">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <h2 className="font-bold font-playfair text-3xl">Welcome</h2>
              <p className="text-sm mt-2">
                Sign in using your student portal account
              </p>
            </div>

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FieldGroup>
                <Controller
                  name="username"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="username">
                        Username
                      </FieldLabel>
                      <Input
                        {...field}
                        id="username"
                        type="text"
                        placeholder="john@gmail.com"
                      />
                      {fieldState.error && (
                        <FieldError>
                          {fieldState.error.message}
                        </FieldError>
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <div className="flex justify-between">
                        <FieldLabel htmlFor="password">
                          Password
                        </FieldLabel>
                        <FieldLabel className="cursor-pointer">
                          Forgot Password?
                        </FieldLabel>
                      </div>
                      <div className="relative">
                        <Input
                          {...field}
                          id="password"
                          type={showPassword ? "text" : "password"}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword((current) => !current)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </Button>
                      </div>
                      {fieldState.error && (
                        <FieldError>
                          {fieldState.error.message}
                        </FieldError>
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-brand-blue hover:bg-brand-blue/90 text-secondary font-semibold cursor-pointer"
              >
                {isPending ? "Logging in..." : "Login"}
              </Button>
            </form>
            <div className="flex gap-2 text-sm justify-center">
              <p className="text-muted-foreground">Need an account?</p>
              <a className="cursor-pointer">Contact your administrator</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
