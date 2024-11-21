import { useEffect, useReducer, useState } from "react";
import { InputChangePayload } from "../types/index.types";

type NamesTypeMap<T> = {
  [P in keyof T]: P;
};

export type PropertiesOf<T> = {
  [P in keyof T]: T[P];
};

export default function useFormData<T extends object>(initialState: T) {
  const [fieldNames, setFieldNames] = useState(
    {} as unknown as NamesTypeMap<T>
  );
  const [state, dispatch] = useReducer(reducer, initialState);

  function reducer(state: T, payload: InputChangePayload) {
    return {
      ...state,
      [payload.field]: payload.value,
    } as T;
  }

  function reset() {
    Object.keys(initialState).forEach((k) =>
      dispatch({
        field: k,
        value: "",
      })
    );
  }

  function setValues(payload: Partial<PropertiesOf<T>>) {
    Object.keys(payload).map((k) => {
      dispatch({
        field: k,
        value: (payload as Record<string, string>)[k],
      });
    });
  }

  useEffect(() => {
    const _n: Record<string, string> = {};
    Object.keys(initialState).forEach((k) => (_n[k] = k));
    setFieldNames(_n as unknown as NamesTypeMap<T>);
  }, []);

  return {
    resetFormData: reset,
    formData: state,
    handleChange: dispatch,
    fieldNames,
    setFields: setValues,
  };
}
