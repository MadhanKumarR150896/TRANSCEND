import { EllipsisVertical } from "lucide-react";
import { useRef } from "react";
import { DropDown } from "./DropDown";

type DisplayDivProps = {
  id: string;
  name: string;
  isActiveDrop: string | null;
  isSetActiveDrop: (status: string | null) => void;
  toDelete: (id: string) => void;
};

export const DisplayDiv = ({
  id,
  name,
  isActiveDrop,
  isSetActiveDrop,
  toDelete,
}: DisplayDivProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div>
      <div className="bg-neutral-600 text-white font-bold rounded py-1 flex">
        <span className="px-2">{name}</span>
        <button
          ref={buttonRef}
          className="px-1 hover:cursor-pointer"
          onClick={() => isSetActiveDrop(isActiveDrop === id ? null : id)}
        >
          {<EllipsisVertical size={15} />}
        </button>
      </div>
      {isActiveDrop === id && (
        <DropDown
          id={id}
          buttonRef={buttonRef}
          toDelete={toDelete}
          isActiveDrop={isActiveDrop}
          isSetActiveDrop={isSetActiveDrop}
        />
      )}
    </div>
  );
};
