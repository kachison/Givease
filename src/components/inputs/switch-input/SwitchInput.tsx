import { InputProps } from "../__base__/Inputs.types";

export default function SwitchInput(
  props: InputProps & { valueWhenChecked: string; valueWhenUnchecked: string }
) {
  const isChecked = props.value === props.valueWhenChecked;
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-9 border rounded-full px-1 py-0.5 border-accent-6 ${
          isChecked ? "bg-pink-secondary" : "bg-accent-5"
        }`}
        onClick={() =>
          props.onChange({
            field: props.name,
            value: isChecked
              ? props.valueWhenUnchecked
              : props.valueWhenChecked,
          })
        }
      >
        <div
          className={`w-4 h-4 rounded-full transform transition-transform ${
            isChecked
              ? "bg-pink-primary translate-x-3/4"
              : "bg-white translate-x-0"
          }`}
        />
      </div>
      <p className="text-sm text-accent-2">{props.label}</p>
    </div>
  );
}
