"use client";

import { useRouter } from "next/navigation";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

import React from "react";
import { loginAction, signupAction } from "@/actions/users";

type Props = {
  type: "login" | "signUp";
};

function AuthForm({ type }: Props) {
  const isLoginForm = type === "login";
  const isSignUpForm = type === "signUp";

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      try {
        let result;
        if (isLoginForm) {
          result = await loginAction(email, password);
        } else {
          result = await signupAction(email, password);
        }

        const { errorMessage } = result;

        if (errorMessage === null) {
          const title = isLoginForm ? "Login" : "Sign Up";
          const description = isLoginForm
            ? "Logged in successfully"
            : "Check your email for verification";

          toast.success(title, {
            description: description,
          });

          router.replace("/");
        } else {
          toast.error(errorMessage);
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
        console.error(error);
      }
    });
  };

  return (
    <form action={handleSubmit}>
      <CardContent className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            required
            disabled={isPending}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            required
            disabled={isPending}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col mt-4 gap-4">
        <Button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 w-full"
          disabled={isPending}
        >
          {isLoginForm ? "Login" : "Sign Up"}
        </Button>
        <div className="flex justify-center items-center mt-4 gap-4">
          <p>
            {isLoginForm
              ? "Don't have an account yet?"
              : "Already have an account?"}
          </p>
          <Link
            href={isLoginForm ? "/signup" : "/login"}
            className={`text-blue-500 hover:underline ${
              isPending ? "pointer-events-none opacity-50" : ""
            }`}
          >
            {isLoginForm ? "Sign Up" : "Login"}
          </Link>
        </div>
      </CardFooter>
    </form>
  );
}

export default AuthForm;
