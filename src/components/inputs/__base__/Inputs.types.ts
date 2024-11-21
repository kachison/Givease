import { InputHTMLAttributes, ReactNode } from "react";
import {
  InputChangePayload,
  PartialRequired,
} from "../../../utils/types/index.types";
import { ZodSchema } from "zod";

export type InputProps<E = HTMLInputElement> = PartialRequired<
  Omit<InputHTMLAttributes<E>, "className" | "onChange"> & {
    label: ReactNode;
    onChange: (payload: InputChangePayload) => void;
    validationTrigger?: string | null;
    validation?: ZodSchema;
  },
  "name" | "value"
>;
