import Loader from "@/components/feedbacks/loader/Loader";
import { TextInput } from "@/components/inputs/text-input/TextInput";
import AuthService from "@/http/Auth.service";
import AuthLayout from "@/layouts/AuthLayout";
import { Routes } from "@/utils/config/routes.config";
import { useForm } from "@/utils/hooks/useForm.hook";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { z } from "zod";

export default function RegisterTemplate() {
  const router = useRouter();
  const [isActionSubmitting, setIsActionSubmitting] = useState(false);

  const form = useForm({
    initialFormData: {
      firstName: "",
      lastName: "",
      emailAddress: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema(formData) {
      return z.object({
        firstName: z.string().min(3, "Enter a valid first name"),
        lastName: z.string().min(3, "Enter a valid last name"),
        emailAddress: z.string().email("Enter a valid email address"),
        password: z
          .string()
          .regex(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
            "Password must be a minimum of 8 characters and must include an uppercase, lowercase and special character."
          ),
        confirmPassword: !formData.password
          ? z.string().min(1, "Please confirm your password")
          : z.literal(formData.password, {
              errorMap: () => {
                return { message: "Password does not match" };
              },
            }),
      });
    },
    async onSubmit(formData) {
      setIsActionSubmitting(true);
      const { data, error } = await AuthService.CreateDonor(formData);
      setIsActionSubmitting(false);

      enqueueSnackbar({
        message: data?.message || error?.message,
        variant: data ? "success" : "error",
      });

      if (data) {
        router.push(Routes.Donor.Board);
      }
    },
  });

  return (
    <AuthLayout>
      <section className="bg-bg-primary min-h-dvh flex w-full">
        <div className="w-full m-auto">
          <form
            onSubmit={form.handleSubmit}
            className="max-w-lg w-10/12 m-auto grid gap-5 py-10"
          >
            <header>
              <h1 className="text-4xl font-semibold">Create an account</h1>
              <p className="text-stone-500">
                Let’s get you started real quick.
              </p>
            </header>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <TextInput
                label="First name"
                placeholder="e.g - Jane"
                name={form.fieldNames.firstName}
                onChange={form.handleChange}
                value={form.formData.firstName}
                validation={form.validationSchema?.firstName}
                validationTrigger={form.validationError}
              />
              <TextInput
                label="Last name"
                placeholder="e.g - Doe"
                name={form.fieldNames.lastName}
                onChange={form.handleChange}
                value={form.formData.lastName}
                validation={form.validationSchema?.lastName}
                validationTrigger={form.validationError}
              />
            </div>

            <TextInput
              label="Email Address"
              placeholder="username@website.com"
              name={form.fieldNames.emailAddress}
              onChange={form.handleChange}
              value={form.formData.emailAddress}
              validation={form.validationSchema?.emailAddress}
              validationTrigger={form.validationError}
            />

            <TextInput
              label="Password"
              type="password"
              placeholder="* * * * * * * *"
              iconRight={<Icon icon={"ri:eye-close-fill"} width={20} />}
              name={form.fieldNames.password}
              onChange={form.handleChange}
              value={form.formData.password}
              validation={form.validationSchema?.password}
              validationTrigger={form.validationError}
            />

            <TextInput
              label="Confirm Password"
              type="password"
              placeholder="* * * * * * * *"
              iconRight={<Icon icon={"ri:eye-close-fill"} width={20} />}
              name={form.fieldNames.confirmPassword}
              onChange={form.handleChange}
              value={form.formData.confirmPassword}
              validation={form.validationSchema?.confirmPassword}
              validationTrigger={form.validationError}
            />

            <button className="bg-primary text-sm font-medium rounded-full py-2.5 flex items-center justify-center w-full text-white">
              {isActionSubmitting ? <Loader /> : "Create account"}
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
