/* eslint-disable @typescript-eslint/no-unused-vars */
import { Icon } from "@iconify/react/dist/iconify.js";
import useFileInput from "../useFileInput";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { BannerUploadViewProps } from "./BannerUploadView.types";
import { useState } from "react";
import useClickOut from "@bscop/use-click-out";

export default function BannerUploadView(props: BannerUploadViewProps) {
  const {
    id,
    onChange,
    hidden,
    type,
    value,
    label,
    validation,
    preview,
    validationTrigger,
    defaultValue,
    ...inputProps
  } = props;
  const h = useFileInput(props);
  const [ref] = useAutoAnimate();
  const [isActionExpandPreview, setIsActionExpandPreview] = useState(false);
  const previewRef = useClickOut<HTMLImageElement>(() =>
    setIsActionExpandPreview(false)
  );

  return (
    <section ref={ref} className="w-full">
      {isActionExpandPreview && (
        <div className="bg-black bg-opacity-20 fixed top-0 left-0 z-10 h-full w-full flex">
          <img
            ref={previewRef}
            src={props.value.toString() || props.defaultValue?.toString()}
            alt=""
            className="aspect-auto max-w-xl rounded-xl m-auto w-11/12 shadow-2xl transition-transform"
          />
        </div>
      )}

      <p className="flex items-center text-stone-500 text-sm gap-2 mb-1">
        {props.label}
      </p>

      <div className="gap-1 flex items-end">
        {(props.value || props.defaultValue) && props.preview && (
          <img
            src={props.value.toString() || props.defaultValue?.toString()}
            alt=""
            className="w-[40px] h-[40px] rounded-md border p-1 border-accent-5 object-contain bg-black cursor-zoom-in"
            onClick={() => setIsActionExpandPreview(true)}
          />
        )}

        <label
          tabIndex={0}
          className={`flex w-full border transition-colors duration-200 border-stone-200  rounded-lg min-h-[40px] cursor-pointer relative overflow-hidden truncate max-w-full z-[1] bg-white`}
          htmlFor={props.id ?? props.name}
        >
          {h.isUploading && (
            <div
              className={`transition-[width] duration-300 absolute top-0 left-0 h-full bg-orange-100`}
              style={{ width: `${h.percentageUpload}%`, zIndex: -1 }}
            />
          )}
          <p
            className={`flex items-center gap-3 truncate max-w-md mx-auto px-3`}
          >
            <Icon
              icon={"solar:camera-bold"}
              className={`text-stone-300 transition-colors duration-200 flex-shrink-0`}
              width={20}
            />
            <span
              className={`text-xs transition-colors duration-200 truncate ${
                props.value ? "text-stone-500 font-medium" : "text-stone-300"
              }`}
            >
              {h.placeholder}
            </span>
          </p>
        </label>
      </div>

      <input
        type="file"
        hidden
        id={props.id ?? props.name}
        onChange={h.handleChange}
        {...inputProps}
      />

      {h.validationError && (
        <p className={"mt-0 leading-none text-red-400"}>
          <span className={"text-[11px] leading-none font-light"}>
            {h.validationError}
          </span>
        </p>
      )}
    </section>
  );
}
