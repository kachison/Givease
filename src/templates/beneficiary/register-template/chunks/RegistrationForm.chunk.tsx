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

function useRegistrationFormChunk() {
  const router = useRouter();
  const [isActionSubmitting, setIsActionSubmitting] = useState(false);

  const form = useForm({
    initialFormData: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema(formData) {
      return z.object({
        firstName: z.string().min(3, "Enter a valid first name"),
        lastName: z.string().min(3, "Enter a valid last name"),
        phoneNumber: z.string().min(10, "Enter a valid phone number"),
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
      const { data, error } = await AuthService.CreateBeneficiary(formData);
      setIsActionSubmitting(false);

      enqueueSnackbar({
        message: data?.message || error?.message,
        variant: data ? "success" : "error",
      });

      if (data) {
        router.push(Routes.Beneficiary.Marketplace);
      }
    },
  });

  return { form, isActionSubmitting };
}

export default function RegistrationFormChunk() {
  const h = useRegistrationFormChunk();
  return (
    <form
      onSubmit={h.form.handleSubmit}
      className="max-w-lg w-10/12 m-auto grid gap-5 py-10"
    >
      <header>
        <h1 className="text-4xl font-semibold">Create an account</h1>
        <p className="text-stone-500">Let’s get you started real quick.</p>
      </header>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <TextInput
          label="First name"
          placeholder="e.g - Jane"
          name={h.form.fieldNames.firstName}
          onChange={h.form.handleChange}
          value={h.form.formData.firstName}
          validation={h.form.validationSchema?.firstName}
          validationTrigger={h.form.validationError}
        />
        <TextInput
          label="Last name"
          placeholder="e.g - Doe"
          name={h.form.fieldNames.lastName}
          onChange={h.form.handleChange}
          value={h.form.formData.lastName}
          validation={h.form.validationSchema?.lastName}
          validationTrigger={h.form.validationError}
        />
      </div>

      <TextInput
        label="Phone Number"
        type="number"
        placeholder="e.g +2340123456780"
        name={h.form.fieldNames.phoneNumber}
        onChange={h.form.handleChange}
        value={h.form.formData.phoneNumber}
        validation={h.form.validationSchema?.phoneNumber}
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

      <TextInput
        label="Confirm Password"
        type="password"
        placeholder="* * * * * * * *"
        iconRight={<Icon icon={"ri:eye-close-fill"} width={20} />}
        name={h.form.fieldNames.confirmPassword}
        onChange={h.form.handleChange}
        value={h.form.formData.confirmPassword}
        validation={h.form.validationSchema?.confirmPassword}
        validationTrigger={h.form.validationError}
      />

      <button className="bg-primary text-sm font-medium rounded-full py-2.5 flex items-center justify-center w-full text-white">
        {h.isActionSubmitting ? <Loader /> : "Create account"}
      </button>
    </form>
  );
}
