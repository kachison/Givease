import { useEffect, useState } from "react";
import { SelectInputProps } from "./SelectInput.types";
import { ListItem } from "../../../utils/types/index.types";

export default function useSelectInput(props: SelectInputProps) {
  const [options, setOptions] = useState<Array<ListItem>>(props.options || []);
  const [selectedOption, setSelectedOption] = useState<ListItem | undefined>(
    undefined
  );

  useEffect(() => {
    setOptions(props.options || []);
  }, [props.options]);

  useEffect(() => {
    const __selected = getInputOption(props.value.toString());
    setSelectedOption(__selected);
    if (!props.comboBox) return;

    if (!__selected) {
      const searchResult = props.options?.filter((opt) =>
        opt.name.toLowerCase().includes(props.value?.toString().toLowerCase())
      );
      setOptions(searchResult ?? []);
      return;
    }
    setOptions(props.options || []);
  }, [props.value]);

  function getInputOption(value: string) {
    return props.options?.find((option) => option.id === value);
  }

  function handleClearSelection() {
    if (props.value) {
      props.onChange({
        field: props.name,
        value: "",
      });
    }
  }

  return {
    options: options.map((opt) => ({
      ...opt,
      action() {
        props.onChange({
          field: props.name,
          value: opt.id,
        });
      },
    })),
    selectedOption,
    handleClearSelection,
  };
}
