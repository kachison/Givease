import Loader from "@/components/feedbacks/loader/Loader";
import { TextInput } from "@/components/inputs/text-input/TextInput";
import AuthService from "@/http/Auth.service";
import { Routes } from "@/utils/config/routes.config";
import { useForm } from "@/utils/hooks/useForm.hook";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/router";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";
import { z } from "zod";

function useSignInFormChunk() {
  const [isActionSubmitting, setIsActionSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm({
    initialFormData: {
      identifier: "",
      password: "",
    },
    validationSchema(formData) {
      return z.object({
        identifier: z
          .string()
          .min(1, "Enter a valid email address or phone number"),
        password: z
          .string()
          .regex(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
            "Password must be a minimum of 8 characters and must include an uppercase, lowercase and special character."
          ),
      });
    },
    async onSubmit(formData) {
      setIsActionSubmitting(true);
      const { data, error } = await AuthService.CreateSession(formData);
      setIsActionSubmitting(false);

      enqueueSnackbar({
        message: data?.message || error?.message,
        variant: data ? "success" : "error",
      });

      if (data) {
        if (data.data.beneficiary) {
          router.push(Routes.Beneficiary.Marketplace);
        }

        if (data.data.merchant) {
          router.push(Routes.Merchant.Store);
        }

        if (data.data.donor) {
          router.push(Routes.Donor.Board);
        }
      }
    },
  });

  return { form, isActionSubmitting };
}

export default function SignInFormChunk() {
  const h = useSignInFormChunk();
  return (
    <form
      onSubmit={h.form.handleSubmit}
      className="max-w-lg w-10/12 m-auto grid gap-5 py-10"
    >
      <header className="mb-4">
        <h1 className="text-4xl font-medium">Welcome Back</h1>
        <p className="text-stone-500">Enter your details and continue.</p>
      </header>

      <TextInput
        label="Email / Phone number"
        placeholder="Enter your email address or phone number"
        name={h.form.fieldNames.identifier}
        onChange={h.form.handleChange}
        value={h.form.formData.identifier}
        validation={h.form.validationSchema?.identifier}
        validationTrigger={h.form.validationError}
      />

      <TextInput
        label="Password"
        type="password"
        placeholder="* * * * * * * *"
        iconRight={<Icon icon={"ri:eye-close-fill"} width={20} />}
        name={h.form.fieldNames.password}
        onChange={h.form.handleChange}
        value={h.form.formData.password}
        validation={h.form.validationSchema?.password}
        validationTrigger={h.form.validationError}
      />

      <button className="bg-primary text-sm font-medium rounded-full py-2.5 flex items-center justify-center w-full text-white">
        {h.isActionSubmitting ? <Loader /> : "Continue to dashboard"}
      </button>
    </form>
  );
}
