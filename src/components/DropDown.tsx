import { Trash } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

type DropDownProps = {
  id: string;
  buttonRef: RefObject<HTMLButtonElement | null>;
  isActiveDrop: string | null;
  isSetActiveDrop: (status: string | null) => void;
  toDelete: (id: string) => void;
};

export const DropDown = ({
  id,
  buttonRef,
  isActiveDrop,
  isSetActiveDrop,
  toDelete,
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
      window.addEventListener("scroll", updatePosition, true);
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
      className="fixed hover:cursor-pointer bg-neutral-200 py-1 px-2 rounded border border-neutral-400 text-xs md:text-sm"
    >
      <div
        onClick={() => {
          toDelete(id);
          isSetActiveDrop(null);
        }}
        className="flex gap-2 items-center"
      >
        <Trash size={11} />
        <span>Delete</span>
      </div>
    </div>,
    document.body
  );
};
