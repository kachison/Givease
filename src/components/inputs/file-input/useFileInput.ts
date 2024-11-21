import { ChangeEvent, useEffect, useState } from "react";
import { InputProps } from "../__base__/Inputs.types";
import { useInput } from "../__base__/useInput";
import axios from "axios";
import { BannerUploadViewProps } from "./views/BannerUploadView.types";

export default function useFileInput(props: BannerUploadViewProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [placeholder, setPlaceholder] = useState(props.placeholder ?? "");
  const [percentageUpload, setPercentageUpload] = useState(0);
  const { validationError, ...inputInstance } = useInput(props);
  const [internalError, setInternalError] = useState("");

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setInternalError("");
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("upload_preset", "kodobe_studio");
    formData.append("file", file);

    try {
      setIsUploading(true);
      setPlaceholder("Uploading...");
      const { data } = await axios.post(
        "https://api.cloudinary.com/v1_1/devtenotea/upload",
        formData,
        {
          onUploadProgress(progressEvent) {
            setPercentageUpload(
              Number(((progressEvent.progress ?? 0) * 100).toFixed(2))
            );
          },
        }
      );

      setIsUploading(false);
      setPercentageUpload(0);

      props.onChange(
        {
          field: props.name,
          value: data.secure_url,
        },
        data
      );
    } catch (error) {
      setPlaceholder(props.placeholder ?? "");
      setInternalError(
        "An error occurred during upload. Select the file and try again"
      );
    }
  }

  useEffect(() => {
    if (!props.value) return;
    const filename = props.value.toString().split("/");
    setPlaceholder(filename[filename.length - 1]);
  }, [props.value]);

  return {
    ...inputInstance,
    handleChange,
    placeholder,
    percentageUpload,
    isUploading,
    validationError: internalError || validationError,
  };
}
