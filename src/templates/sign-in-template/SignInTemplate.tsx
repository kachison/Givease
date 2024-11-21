import AuthLayout from "@/layouts/AuthLayout";
import React from "react";
import SignInFormChunk from "./chunks/SignInForm.chunk";
import Link from "next/link";
import { Routes } from "@/utils/config/routes.config";

export default function SignInTemplate() {
  return (
    <AuthLayout>
      <section className="bg-bg-primary min-h-dvh flex">
        <div className="m-auto w-full">
          <SignInFormChunk />
          <p className="text-stone-600 max-w-max mx-auto">
            Don&apos;t have an account?{" "}
            <Link
              href={Routes.SignUp}
              className="underline text-primary font-medium"
            >
              {" "}
              Sign up here{" "}
            </Link>
          </p>
        </div>
      </section>
    </AuthLayout>
  );
}
