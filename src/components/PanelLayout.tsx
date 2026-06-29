import { X } from "lucide-react";
import type { ReactNode } from "react";

type PanelType = "Project" | "Member";

type PanelLayoutProps = {
  title: PanelType;
  isCreate: boolean;
  isSetCreate: (status: boolean) => void;
  isIsLoading?: boolean;
  loadingMessage?: string;
  children?: ReactNode;
  formElement?: ReactNode;
};

export const PanelLayout = ({
  title,
  isCreate,
  isSetCreate,
  isIsLoading,
  loadingMessage,
  children,
  formElement,
}: PanelLayoutProps) => {
  return (
    <div className="flex-1 border rounded bg-white border-neutral-300 p-2 flex flex-col gap-2 min-h-0">
      <div className="flex justify-between items-center font-semibold">
        <div className="bg-neutral-200 rounded py-1 px-4">{`${title}s`}</div>
        <button
          className="bg-neutral-900 text-white py-1 px-4 rounded hover:cursor-pointer"
          onClick={() => isSetCreate(true)}
        >
          {`Create ${title}`}
        </button>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none">
        <div className="flex flex-wrap whitespace-nowrap py-4 px-1 gap-2">
          {isIsLoading ? loadingMessage : children}
        </div>
      </div>
      {isCreate && (
        <div className="border p-2 rounded border-neutral-300 z-10 flex items-center justify-between">
          {formElement}
          <button
            className={`hover:cursor-pointer ${title === "Member" ? "mbe-auto" : ""}`}
            type="button"
            onClick={() => isSetCreate(false)}
          >
            <X strokeWidth={1} size={25} />
          </button>
        </div>
      )}
    </div>
  );
};
