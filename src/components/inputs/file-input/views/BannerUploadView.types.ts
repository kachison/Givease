import { InputProps } from "../../__base__/Inputs.types";
import { InputChangePayload } from "@/utils/types/index.types";

export type BannerUploadViewProps = Omit<InputProps, "onChange"> & {
  preview?: boolean;
  onChange: (payload: InputChangePayload, sourcePayload?: any) => void;
};
