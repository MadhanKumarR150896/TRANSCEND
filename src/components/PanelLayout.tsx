import { X } from "lucide-react";
import type { Dispatch, ReactNode, RefObject, SetStateAction } from "react";

type PanelTitle = "Projects" | "Members" | "Project Members" | "Lists";
type ButtonVariant =
  | "Create Project"
  | "Create Member"
  | "Add Member"
  | "Create List"
  | "Create Tasks";

type PanelLayoutProps = {
  title?: PanelTitle;
  listName?: string;
  variant: ButtonVariant;
  isCreate: boolean;
  isSetCreate: Dispatch<SetStateAction<boolean>>;
  isSetActivedrop?: Dispatch<SetStateAction<string | null>>;
  buttonRef: RefObject<HTMLButtonElement | null>;
  isIsLoading?: boolean;
  loadingMessage?: string;
  children?: ReactNode;
  formElement?: ReactNode;
  displayElement?: ReactNode;
};

export const PanelLayout = ({
  title,
  listName,
  variant,
  isCreate,
  buttonRef,
  isSetCreate,
  isSetActivedrop,
  isIsLoading,
  loadingMessage,
  children,
  formElement,
  displayElement,
}: PanelLayoutProps) => {
  return (
    <div
      className={`flex-1 border rounded bg-white border-neutral-400 p-2 flex flex-col gap-2 ${listName ? "h-110 min-w-90 max-w-100 shadow-md shadow-black" : "min-h-60 md:min-h-80 lg:min-h-60"}`}
    >
      <div
        className={`flex ${listName ? "flex-row-reverse" : ""} justify-between items-center font-semibold`}
      >
        {title && (
          <div className="bg-neutral-200 rounded py-1 px-4">{title}</div>
        )}
        {listName && displayElement}
        <button
          ref={buttonRef}
          className="bg-neutral-900 text-white py-1 px-4 rounded hover:cursor-pointer"
          onClick={() => isSetCreate(true)}
        >
          {variant}
        </button>
      </div>
      <div
        className="flex-1 min-h-0 overflow-y-auto scrollbar-none border-t border-t-neutral-400"
        onScroll={() => isSetActivedrop?.(null)}
      >
        <div className="flex flex-wrap whitespace-nowrap py-4 px-1 gap-2">
          {isIsLoading ? loadingMessage : children}
        </div>
      </div>
      {isCreate && (
        <div className="relative border p-2 rounded border-neutral-300 z-10 flex items-center justify-between">
          {formElement}
          <button
            className={`hover:cursor-pointer ${title === "Members" || listName ? "absolute top-2 right-2" : ""}`}
            type="button"
          >
            <X strokeWidth={1} size={25} />
          </button>
        </div>
      )}
    </div>
  );
};
