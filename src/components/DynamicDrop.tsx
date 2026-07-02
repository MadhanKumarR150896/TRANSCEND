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
import type { MemberE } from "../supabase/dataTypes";

type InputDropProps = {
  parentRef: RefObject<HTMLDivElement | null>;
  setInputValue: Dispatch<SetStateAction<string>>;
  setInsertValue: Dispatch<SetStateAction<string>>;
  results: MemberE[] | undefined;
};

export const DynamicDrop = ({
  parentRef,
  setInputValue,
  setInsertValue,
  results,
}: InputDropProps) => {
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const dropRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!parentRef.current) return;
    const rect = parentRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + 5,
      left: rect.left,
      width: rect.width,
    });
  }, [parentRef]);

  useLayoutEffect(() => {
    if (!results) return;
    updatePosition();
  }, [results, updatePosition]);

  useEffect(() => {
    if (!results) return;

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [results, updatePosition]);

  useEffect(() => {
    if (!results) return;
    const handleDrop = (e: MouseEvent) => {
      if (
        dropRef.current?.contains(e.target as Node) ||
        parentRef.current?.contains(e.target as Node)
      )
        return;

      setInsertValue("a");
    };

    document.addEventListener("mousedown", handleDrop);

    return () => document.removeEventListener("mousedown", handleDrop);
  }, [results, parentRef, setInsertValue]);

  if (!results) return null;

  return createPortal(
    <div
      ref={dropRef}
      className="fixed z-10 p-1.5 bg-white flex flex-col gap-1.5 rounded-md border border-neutral-400 text-xs md:text-sm"
      style={{
        top: pos.top,
        left: pos.left,
        width: pos.width,
      }}
    >
      {results?.map((result) => (
        <div
          onClick={() => {
            setInputValue(result.name);
            setInsertValue(result.id);
          }}
          className="ps-2 py-0.5 pe-4 hover:cursor-pointer rounded-sm bg-neutral-500 text-white flex flex-col"
          key={result.id}
        >
          <span className="truncate font-semibold">{result.name}</span>
          <span className="truncate text-neutral-100 text-xs">{`(${result.email})`}</span>
        </div>
      ))}
    </div>,
    document.body
  );
};
