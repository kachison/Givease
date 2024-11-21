import { Icon } from "@iconify/react/dist/iconify.js";
import { ExpansionPanelControllerProps } from "./ExpansionPanelController.props";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useState } from "react";

export default function ExpansionPanelController(
  props: ExpansionPanelControllerProps
) {
  const [ref] = useAutoAnimate();
  const [isOpen, setIsOpen] = useState(false);

  function toggleIsOpen() {
    setIsOpen(!isOpen);
  }
  return (
    <section
      ref={ref}
      className={`${isOpen ? "p-0" : "p-5"} border-accent-5 border rounded-lg`}
    >
      <div
        className={`flex items-center justify-between cursor-pointer ${
          isOpen ? "p-5 border-b border-accent-6" : ""
        }`}
        onClick={toggleIsOpen}
      >
        {props.children?.[0]}
        <Icon
          icon={"pepicons-pop:angle-down"}
          className={`${
            isOpen ? "rotate-180" : "rotate-0"
          } transform transition-transform duration-200 text-accent-2`}
        />
      </div>

      {isOpen && (
        <div className={isOpen ? "px-5 py-6" : ""}>{props.children?.[1]}</div>
      )}
    </section>
  );
}
