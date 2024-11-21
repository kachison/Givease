import { InputHTMLAttributes, ReactNode } from "react";
import {
  InputChangePayload,
  PartialRequired,
} from "../../../utils/types/index.types";
import { ZodSchema } from "zod";

export type TextInputProps = PartialRequired<
  Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "onChange"> & {
    label: ReactNode;
    onChange: (payload: InputChangePayload) => void;
    validationTrigger?: string | null;
    validation?: ZodSchema;
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
  },
  "name" | "value"
>;
