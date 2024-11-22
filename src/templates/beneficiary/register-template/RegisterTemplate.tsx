import AuthLayout from "@/layouts/AuthLayout";
import { Routes } from "@/utils/config/routes.config";
import Link from "next/link";
import RegistrationFormChunk from "./chunks/RegistrationForm.chunk";

export default function RegisterTemplate() {
  return (
    <AuthLayout>
      <section className="bg-bg-primary min-h-dvh flex w-full">
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
