import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { ZodError } from "zod";
import { InputProps } from "./Inputs.types";

export function useInput<T = HTMLInputElement>(props: InputProps<T>) {
  const [inputType, setInputType] = useState(props?.type ?? "text");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [parentRef] = useAutoAnimate();

  useEffect(() => {
    if (validationError) {
      validateTextField();
    }
  }, [props.value]);

  useEffect(() => {
    if (!props.validationTrigger) {
      setValidationError(null);
      return;
    }
    validateTextField();
  }, [props.validationTrigger]);

  function validateTextField() {
    try {
      if (props.validation) {
        setValidationError(null);
        props.validation.parse(props.value);
      }
    } catch (error: unknown) {
      setValidationError(
        (error as ZodError).issues[0]?.message || (error as ZodError).message
      );
    }
  }

  function handleChange(e: ChangeEvent<T>) {
    props.onChange({
      field: props.name,
      value: (e.currentTarget as unknown as { value: string }).value,
    });
  }

  useEffect(() => {
    setInputType(props.type ?? "text");
  }, [props.type]);

  return {
    inputType,
    handleChangeInputType: setInputType,
    validationError,
    handleChange,
    parentRef,
  };
}
