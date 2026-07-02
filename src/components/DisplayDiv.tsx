import { EllipsisVertical, Globe, GlobeLock } from "lucide-react";
import { useRef, type Dispatch, type SetStateAction } from "react";
import { StaticDrop } from "./StaticDrop";

export type Display = "Project" | "List";
export type Privacy = "Public" | "Private";

type DisplayDivProps = {
  display?: Display;
  privacy?: Privacy;
  id: string;
  name: string;
  isActiveDrop: string | null;
  isSetActiveDrop: Dispatch<SetStateAction<string | null>>;
  toDelete: (id: string) => void;
  deletePending: boolean;
  toUpdate?: Dispatch<SetStateAction<boolean>>;
};

export const DisplayDiv = ({
  id,
  name,
  display,
  privacy,
  isActiveDrop,
  isSetActiveDrop,
  toDelete,
  toUpdate,
  deletePending,
}: DisplayDivProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div>
      <div
        className={`bg-neutral-600 text-white font-bold rounded py-1 flex ${display === "Project" ? "text-sm md:text-xl bg-neutral-950 gap-4" : ""}`}
      >
        <div className="flex gap-1 items-center">
          <div className="px-2">{name}</div>
          {display === "Project" && (
            <div>
              {privacy === "Public" ? (
                <Globe className="size-3.5 md:size-5" />
              ) : (
                <GlobeLock className="size-3.5 md:size-5" />
              )}
            </div>
          )}
        </div>
        <button
          ref={buttonRef}
          className="px-1 hover:cursor-pointer"
          onClick={() => isSetActiveDrop(isActiveDrop === id ? null : id)}
        >
          {<EllipsisVertical size={15} />}
        </button>
      </div>
      {isActiveDrop === id && (
        <StaticDrop
          id={id}
          buttonRef={buttonRef}
          toDelete={toDelete}
          isActiveDrop={isActiveDrop}
          isSetActiveDrop={isSetActiveDrop}
          deletePending={deletePending}
          display={display}
          toUpdate={toUpdate}
        />
      )}
    </div>
  );
};
