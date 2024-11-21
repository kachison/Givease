import { InputProps } from "../__base__/Inputs.types";
import { useInput } from "../__base__/useInput";

export default function ColorInput(props: InputProps) {
  const { handleChange, inputType, parentRef, validationError } =
    useInput(props);

  return (
    <div ref={parentRef} className="w-full">
      <label
        htmlFor={props.name ?? props.id}
        className="flex items-center text-accent-3 text-xs gap-2 mb-1"
      >
        {props.label}
      </label>
      <div
        className={
          "relative h-[40px] rounded-md border bg-accent-6 bg-opacity-30 text-xs overflow-hidden border-accent-5 flex items-center"
        }
      >
        {/* <label htmlFor={"color" + (props.id ?? props.name)}></label> */}
        <input
          id={"color" + (props.id ?? props.name)}
          className={`h-[30px] flex-shrink-0 w-[30px] border-none appearance-none rounded-md ml-1.5`}
          type={"color"}
          value={props.value}
          onChange={handleChange}
        />

        <input
          // {...inputProps}
          className={`block pl-3 pr-4 flex-grow h-full disabled:cursor-not-allowed disabled:opacity-70 disabled:bg-gray-100 text-ellipsis bg-transparent placeholder:font-light placeholder:text-accent-4 text-accent-2 font-medium outline-none`}
          type={inputType}
          value={props.value}
          onChange={handleChange}
          placeholder={props.placeholder}
        />
      </div>
      {validationError != null && (
        <p className={"leading-none text-red-400"}>
          <span className={"text-[11px] leading-none font-light"}>
            {validationError}
          </span>
        </p>
      )}
    </div>
  );
}
