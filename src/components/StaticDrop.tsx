import { Edit, Trash } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import { createPortal } from "react-dom";
import type { Display } from "./DisplayDiv";

type DropDownProps = {
  display?: Display;
  id: string;
  buttonRef: RefObject<HTMLButtonElement | null>;
  isActiveDrop: string | null;
  isSetActiveDrop: Dispatch<SetStateAction<string | null>>;
  toDelete: (id: string) => void;
  deletePending: boolean;
  toUpdate?: (id: boolean) => void;
};

export const StaticDrop = ({
  id,
  buttonRef,
  display,
  isActiveDrop,
  isSetActiveDrop,
  toDelete,
  toUpdate,
  deletePending,
}: DropDownProps) => {
  const [dropPos, setDropPos] = useState({ top: 0, left: 0 });
  const dropRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setDropPos({
      top: rect.bottom + 8,
      left: rect.left,
    });
  }, [buttonRef]);

  useLayoutEffect(() => {
    if (isActiveDrop !== id) return;
    updatePosition();
  }, [isActiveDrop, id, updatePosition]);

  useEffect(() => {
    if (isActiveDrop !== id) return;

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isActiveDrop, id, updatePosition]);

  useEffect(() => {
    if (isActiveDrop !== id) return;
    const handleDrop = (e: MouseEvent) => {
      if (
        dropRef.current?.contains(e.target as Node) ||
        buttonRef.current?.contains(e.target as Node)
      )
        return;

      isSetActiveDrop(null);
    };

    document.addEventListener("mousedown", handleDrop);

    return () => document.removeEventListener("mousedown", handleDrop);
  }, [isActiveDrop, isSetActiveDrop, id, buttonRef]);

  if (isActiveDrop !== id) return null;

  return createPortal(
    <div
      ref={dropRef}
      style={{ top: dropPos.top, left: dropPos.left }}
      className="fixed bg-neutral-200 py-1 px-2 rounded border border-neutral-400 text-xs md:text-sm flex flex-col gap-1"
    >
      {display === "Project" && (
        <button
          onClick={() => {
            toUpdate?.(true);
            isSetActiveDrop(null);
          }}
          className="hover:cursor-pointer flex gap-2 pbe-1 items-center border-b border-b-neutral-400"
        >
          <Edit size={11} />
          <span>Update</span>
        </button>
      )}
      <button
        disabled={deletePending}
        onClick={() => {
          toDelete(id);
          isSetActiveDrop(null);
        }}
        className="hover:cursor-pointer flex gap-2 items-center"
      >
        <Trash size={11} />
        <span>Delete</span>
      </button>
    </div>,
    document.body
  );
};
