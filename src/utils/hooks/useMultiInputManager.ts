import { useEffect, useState } from "react";
import { InputChangePayload } from "../types/index.types";

type UseMultiInputManagerParams<T> = {
  initialValue: T;
};

export default function useMultiInputManager<T>(
  params: UseMultiInputManagerParams<T>
) {
  const [values, setValues] = useState<T[]>([]);

  function handleAddValue() {
    const __values = values.slice();
    __values.push(params.initialValue);
    setValues(__values);
  }

  function handleRemoveValue(index: number) {
    const __values = values.slice();
    __values.splice(index, 1);
    setValues(__values);
  }

  /**
   * payload.field must be a member of keyof T
   */
  function handleUpdateValue(index: number, payload: InputChangePayload) {
    const __values = values.slice();
    if (!__values[index]) return;
    (__values[index] as Record<string, string>)[payload.field] = payload.value;
    setValues(__values);
  }

  function handleSetDefault(defaultValues: T[]) {
    setValues(defaultValues);
  }

  useEffect(() => {
    if (values.length < 1) {
      handleAddValue();
    }
  }, []);

  return {
    values,
    add: handleAddValue,
    remove: handleRemoveValue,
    update: handleUpdateValue,
    setDefault: handleSetDefault,
  };
}
