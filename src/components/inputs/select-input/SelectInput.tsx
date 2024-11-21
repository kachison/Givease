/* eslint-disable @typescript-eslint/no-unused-vars */
import { Icon } from "@iconify/react/dist/iconify.js";
import DropDownController from "../../controllers/drop-down-controller/DropDownController";
import { TextInput } from "../text-input/TextInput";
import { SelectInputProps } from "./SelectInput.types";
import useSelectInput from "./useSelectInput";

export default function SelectInput(props: SelectInputProps) {
  const h = useSelectInput(props);
  const { value, ...inputProps } = props;
  return (
    <DropDownController options={h.options} top={67}>
      <TextInput
        {...inputProps}
        value={h.selectedOption?.name || props.value}
        label={props.label || <>&nbsp;</>}
        iconRight={
          <Icon
            icon={props.value ? "lets-icons:close-round" : "quill:expand"}
            width={16}
            onClick={h.handleClearSelection}
            className="text-accent-2"
          />
        }
        readOnly={!props.comboBox}
        style={!props.comboBox ? { outline: "none", cursor: "pointer" } : {}}
      />
    </DropDownController>
  );
}
