import { ListItem } from "../../../utils/types/index.types";
import { TextInputProps } from "../text-input/TextInput.types";

export type SelectInputProps = TextInputProps & {
  options?: ListItem[];
  comboBox?: boolean;
};
