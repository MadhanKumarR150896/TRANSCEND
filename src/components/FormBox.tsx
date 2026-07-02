import {
  useEffect,
  type Dispatch,
  type RefObject,
  type SetStateAction,
  type SyntheticEvent,
} from "react";

type InputType = "text" | "email";
type Privacy = "Public" | "Private";

type FormBoxProps = {
  formRef: RefObject<HTMLDivElement | null>;
  buttonRef?: RefObject<HTMLButtonElement | null>;
  onSubmit: (e: SyntheticEvent<HTMLFormElement, Event>) => void;
  iOneType: InputType;
  iOneName: string;
  iOnePlace: string;
  iOne: string | undefined;
  setIOne: Dispatch<SetStateAction<string>>;
  extraOne?: Dispatch<SetStateAction<string>>;
  iTwoType?: InputType;
  iTwoName?: string;
  iTwoPlace?: string;
  iTwo?: string | undefined;
  setITwo?: Dispatch<SetStateAction<string>>;
  isPending?: boolean;
  sName?: string;
  sValue?: string;
  setSValue?: Dispatch<SetStateAction<Privacy>>;
  onClose: () => void;
};

export const FormBox = ({
  onSubmit,
  iOneType,
  iOneName,
  iOnePlace,
  formRef,
  buttonRef,
  iOne,
  setIOne,
  extraOne,
  iTwoType,
  isPending,
  iTwoPlace,
  iTwo,
  iTwoName,
  setITwo,
  sName,
  sValue,
  setSValue,
  onClose,
}: FormBoxProps) => {
  useEffect(() => {
    if (!formRef.current) return;
    const handleForm = (e: MouseEvent) => {
      if (
        formRef.current?.contains(e.target as Node) ||
        buttonRef?.current?.contains(e.target as Node)
      )
        return;
      onClose();
    };

    document.addEventListener("mousedown", handleForm);

    return () => document.removeEventListener("mousedown", handleForm);
  }, [formRef, onClose, buttonRef]);

  return (
    <form
      autoComplete="off"
      onSubmit={onSubmit}
      className={`flex ${iTwoType || sName ? "flex-col" : ""} gap-2`}
    >
      <fieldset name={iOneName} className="flex items-center gap-2">
        <label htmlFor={iOneName}>Name</label>
        <input
          id={iOneName}
          name={iOneName}
          placeholder={iOnePlace}
          type={iOneType}
          className="outline-none rounded bg-neutral-200 p-1"
          value={iOne}
          onChange={(e) => {
            setIOne(e.target.value);
            extraOne?.("");
          }}
        />
      </fieldset>
      <div className="flex gap-2">
        {iTwoType && (
          <fieldset name={iTwoName} className="flex items-center gap-2">
            <label htmlFor={iTwoName} className="pe-1">
              Email
            </label>
            <input
              id={iTwoName}
              name={iTwoName}
              placeholder={iTwoPlace}
              type={iTwoType}
              className="outline-none rounded bg-neutral-200 p-1"
              value={iTwo}
              onChange={(e) => setITwo?.(e.target.value)}
            />
          </fieldset>
        )}
        {sName && (
          <div className="flex flex-1 items-center gap-2">
            <label htmlFor={sName}>Privacy</label>
            <select
              name={sName}
              id={sName}
              value={sValue}
              onChange={(e) => setSValue?.(e.target.value as Privacy)}
              className="outline-none rounded border border-neutral-400"
            >
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
          </div>
        )}
        <button
          className="bg-neutral-200 py-1 px-2 rounded hover:cursor-pointer"
          type="submit"
        >
          {isPending ? "Creating" : "Submit"}
        </button>
      </div>
    </form>
  );
};
