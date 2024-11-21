import { DropDownControllerProps } from "./DropDownController.types";
import useDropDownController from "./useDropDownController";

export default function DropDownController(props: DropDownControllerProps) {
  const h = useDropDownController();
  return (
    <div ref={h.dropDownRef as never} className="relative w-full">
      <div
        onClick={h.toggleOptionsOpen}
        className="w-full"
        style={{ textAlign: "unset" }}
      >
        {props.children}
      </div>

      {h.isOptionsOpen && (
        <ul
          className="absolute bg-white border border-accent-6 rounded-md min-w-[150px] z-20 shadow-xl shadow-gray-100 w-full max-h-[210px] overflow-auto"
          style={{
            top: props.top ?? undefined,
            bottom: props.bottom ?? undefined,
            right: props.right ?? undefined,
            left: props.left ?? undefined,
          }}
        >
          {(!props.options || props.options.length === 0) && (
            <li className="text-stone-300 text-xs text-center py-3 px-5">
              No options at this moment.
            </li>
          )}

          {props.options?.map((option) => (
            <li
              key={option.id}
              className="py-2.5 px-3 hover:bg-stone-50 text-xs text-accent-2 font-light flex items-center gap-2.5 cursor-pointer border-b-accent-6 border-b"
              onClick={() => {
                option.action?.();
                h.toggleOptionsOpen();
              }}
            >
              {option.icon}
              <span>{option.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
