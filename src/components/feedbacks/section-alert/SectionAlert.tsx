import { ImWarning } from "@/assets/images";
import { ReactNode } from "react";

export default function SectionAlert(props: { children?: ReactNode }) {
  return (
    <div className="border rounded-lg py-5 px-4 flex items-center gap-4 border-stone-200 bg-white">
      <img src={ImWarning.src} className="size-10 flex-shrink-0" />
      <div className="text-xs w-full">{props.children}</div>
    </div>
  );
}
