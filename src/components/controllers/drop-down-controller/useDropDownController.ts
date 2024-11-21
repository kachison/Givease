import useClickOut from "@bscop/use-click-out";
import { useState } from "react";

export default function useDropDownController() {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  function toggleOptionsOpen() {
    setIsOptionsOpen((open) => {
      return !open;
    });
  }

  function handleClickOutside() {
    setIsOptionsOpen(isOptionsOpen ? false : isOptionsOpen);
  }

  const dropDownRef = useClickOut(handleClickOutside);

  return { isOptionsOpen, toggleOptionsOpen, dropDownRef };
}
