import AuthLayout from "@/layouts/AuthLayout";
import React from "react";
import RegistrationFormChunk from "./chunks/RegistrationForm.chunk";
import Link from "next/link";
import { Routes } from "@/utils/config/routes.config";

export default function RegisterTemplate() {
  return (
    <AuthLayout>
      <section className="bg-bg-primary min-h-dvh flex">
        <div className="w-full m-auto">
          <RegistrationFormChunk />
          <p className="text-stone-600 max-w-max mx-auto">
            Already have an account?{" "}
            <Link
              href={Routes.SignIn}
              className="underline text-primary font-medium"
            >
              {" "}
              Sign in here{" "}
            </Link>
          </p>
        </div>
      </section>
    </AuthLayout>
  );
}
