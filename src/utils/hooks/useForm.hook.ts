import type { FormEvent } from "react";
import { useState } from "react";
import useFormData from "./useFormData.hook";
import { ZodError, ZodObject, ZodType } from "zod";

export type ZRawShapeOf<T> = {
  [property in keyof T]: ZodType<T[property]>;
};

export interface UseFormParams<T> {
  initialFormData: T;
  validationSchema?:
    | ((formData: T) => ZodObject<ZRawShapeOf<T>>)
    | ZodObject<ZRawShapeOf<T>>;
  onSubmit?: (formData: T) => Promise<void>;
}

export function useForm<T extends object>(params: UseFormParams<T>) {
  const form = useFormData(params.initialFormData);
  const [timestamp, setTimeStamp] = useState<number | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(e?: FormEvent) {
    console.log("submitt");
    setTimeStamp(Date.now());
    if (e) e.preventDefault();
    validateAndThrow()
      .then(async () => {
        if (params.onSubmit && !validationError) {
          await params.onSubmit(form.formData);
        }
      })
      .catch((error) => {
        setValidationError((error as ZodError).message);
      });
  }

  async function validateAndThrow() {
    if (!params.validationSchema) return;
    setValidationError(null);
    if (typeof params.validationSchema == "object")
      await params.validationSchema.parseAsync(form.formData);
    else {
      await params.validationSchema(form.formData).parseAsync(form.formData);
    }
  }

  async function validate() {
    try {
      validateAndThrow();
    } catch (error: unknown) {
      setValidationError((error as ZodError).message);
    }
  }

  return {
    ...form,
    submissionTimestamp: timestamp,
    handleSubmit,
    validationError,
    validationSchema:
      typeof params.validationSchema == "object"
        ? params.validationSchema?.shape
        : params.validationSchema?.(form.formData)?.shape,
    validate,
  };
}
