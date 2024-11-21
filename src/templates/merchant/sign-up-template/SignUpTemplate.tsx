import { TextInput } from "@/components/inputs/text-input/TextInput";
import AuthService from "@/http/Auth.service";
import AuthLayout from "@/layouts/AuthLayout";
import { Routes } from "@/utils/config/routes.config";
import { useForm } from "@/utils/hooks/useForm.hook";
import Link from "next/link";
import { useRouter } from "next/router";
import { enqueueSnackbar } from "notistack";
import React from "react";
import { z } from "zod";

function useSignUpTemplate() {
  const router = useRouter();
  const form = useForm({
    initialFormData: {
      firstName: "",
      lastName: "",
      businessName: "",
      emailAddress: "",
      password: "",
    },
    validationSchema: z.object({
      businessName: z.string().min(3, "Enter a valid business name"),
      emailAddress: z.string().email("Enter a valid email address"),
      firstName: z.string().min(3, "Enter a valid first name"),
      lastName: z.string().min(3, "Enter a valid last name"),
      password: z
        .string()
        .regex(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
          "Password must be a minimum of 8 characters and must include an uppercase, lowercase and special character."
        ),
    }),
    async onSubmit(formData) {
      const { data, error } = await AuthService.CreateMerchant(formData);
      enqueueSnackbar({
        message: data?.message || error?.message,
        variant: data ? "success" : "error",
      });

      if (data) {
        router.push(Routes.Merchant.Store);
      }
    },
  });
  return { form };
}

export default function SignUpTemplate() {
  const h = useSignUpTemplate();
  return (
    <AuthLayout>
      <section className="bg-bg-primary min-h-dvh flex">
        <div className="w-full m-auto">
          <form
            onSubmit={h.form.handleSubmit}
            className="max-w-lg w-10/12 m-auto grid gap-5 py-10"
          >
            <header className="mb-6">
              <h1 className="text-4xl font-semibold">Create an account</h1>
              <p className="text-stone-500">
                Let’s get you started real quick.
              </p>
            </header>

            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="First name"
                placeholder="Jane"
                name={h.form.fieldNames.firstName}
                onChange={h.form.handleChange}
                value={h.form.formData.firstName}
                validation={h.form.validationSchema?.firstName}
                validationTrigger={h.form.validationError}
              />
              <TextInput
                label="Last name"
                placeholder="Doe"
                name={h.form.fieldNames.lastName}
                onChange={h.form.handleChange}
                value={h.form.formData.lastName}
                validation={h.form.validationSchema?.lastName}
                validationTrigger={h.form.validationError}
              />
            </div>

            <TextInput
              label="Business name"
              placeholder="GivEase Co."
              name={h.form.fieldNames.businessName}
              onChange={h.form.handleChange}
              value={h.form.formData.businessName}
              validation={h.form.validationSchema?.businessName}
              validationTrigger={h.form.validationError}
            />

            <TextInput
              label="Email Address"
              type="email"
              placeholder="name@website.com"
              name={h.form.fieldNames.emailAddress}
              onChange={h.form.handleChange}
              value={h.form.formData.emailAddress}
              validation={h.form.validationSchema?.emailAddress}
              validationTrigger={h.form.validationError}
            />

            <TextInput
              label="Password"
              type="password"
              placeholder="* * * * * * * *"
              name={h.form.fieldNames.password}
              onChange={h.form.handleChange}
              value={h.form.formData.password}
              validation={h.form.validationSchema?.password}
              validationTrigger={h.form.validationError}
            />

            <button className="bg-primary text-sm font-medium rounded-full py-2.5 flex items-center justify-center w-full text-white">
              Join as merchant
            </button>
          </form>

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
