"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@/hooks/api/use-login"
import { LoginRequest, loginRequestSchema } from "@/types/kubb/gen";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

export default function AuthPage() {
  const { mutate, isPending } = useLogin();

  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginRequestSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  function onSubmit(values: LoginRequest) {
    mutate({
      body: values,
    });
  }

  return (
    <div className="h-screen grid grid-cols-10">

      {/* Hero Section */}
      <div className="relative overflow-hidden col-span-7">
        <BackgroundGradientAnimation
          gradientBackgroundStart="rgb(44, 58, 208)"
          gradientBackgroundEnd="rgb(30, 40, 150)"
          firstColor="60, 100, 255"
          secondColor="80, 130, 255"
          thirdColor="40, 80, 220"
          fourthColor="70, 120, 255"
          fifthColor="100, 150, 255"
          pointerColor="60, 100, 255"
          size="70%"
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
      <div className="bg-brand-neutral flex flex-col col-span-3">
        <div className="p-8">
          <h3 className="text-xl font-playfair font-semibold">Faculytics 2.0</h3>
        </div>

        <div className="flex grow items-center justify-center px-12">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <h2 className="font-bold font-playfair text-3xl">Welcome</h2>
              <p className="text-sm mt-2 text-muted-foreground">
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
                      <Input
                        {...field}
                        id="password"
                        type="password"
                      />
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
                className="w-full bg-brand-yellow hover:bg-brand-yellow/90 text-black font-semibold cursor-pointer"
                disabled={isPending}
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
