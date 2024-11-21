/* eslint-disable @typescript-eslint/no-unused-vars */
import { TextInputProps } from "./TextInput.types";
import { useTextInput } from "./useTextInput";

export function TextInput(props: TextInputProps) {
  const {
    validationTrigger,
    validation,
    label,
    type,
    onChange,
    name,
    iconLeft,
    iconRight,
    placeholder,
    ...inputProps
  } = props;

  const {
    inputType,
    handleIconClickAction,
    validationError,
    handleChange,
    parentRef,
  } = useTextInput(props);

  return (
    <div ref={parentRef} className="w-full">
      <label
        htmlFor={name}
        className="flex items-center text-stone-500 text-sm gap-2 mb-1"
      >
        {props.label}
      </label>
      <div
        className={
          "relative h-[45px] rounded-xl border bg-transparent text-sm overflow-hidden border-stone-200 flex items-center"
        }
      >
        {iconLeft && (
          <button
            className={`my-auto flex px-1.5 h-full items-center justify-center text-xs text-gray-500 bg-white flex-shrink-0`}
            type={"button"}
            onClick={handleIconClickAction}
          >
            {props.iconLeft}
          </button>
        )}
        <input
          {...inputProps}
          className={`block px-4 flex-grow h-full disabled:cursor-not-allowed  disabled:bg-stone-100 text-ellipsis bg-white placeholder:font-light placeholder:text-stone-400 text-stone-500 font-medium`}
          type={inputType}
          onChange={handleChange}
          onBlur={(e) => {
            props.onChange({
              field: props.name,
              value: props.value.toString().trim(),
            });
            inputProps.onBlur?.(e);
          }}
          placeholder={props.placeholder}
        />
        {props.iconRight && (
          <button
            disabled={props.disabled}
            className={`my-auto flex px-1.5 h-full items-center justify-center text-xs text-gray-500 disabled:bg-gray-100 flex-shrink-0`}
            type={"button"}
            onClick={handleIconClickAction}
          >
            {props.iconRight}
          </button>
        )}
      </div>
      {validationError != null && (
        <p className={"leading-none text-red-500 mt-0.5"}>
          <span className={"text-xs leading-none font-light"}>
            {validationError}
          </span>
        </p>
      )}
    </div>
  );
}
