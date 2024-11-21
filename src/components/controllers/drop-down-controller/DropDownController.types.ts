import { ReactNode } from "react";
import { ListItem } from "../../../utils/types/index.types";

export type DropDownControllerProps = {
  children: ReactNode;
  options?: ListItem[];
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
};
