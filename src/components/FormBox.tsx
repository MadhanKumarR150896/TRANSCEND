import type { SyntheticEvent } from "react";

type InputType = "text" | "email";

type FormBoxProps = {
  onSubmit: (e: SyntheticEvent<HTMLFormElement>) => void;
  iOneType: InputType;
  iOnePLace: string;
  iOne: string;
  setIOne: (input: string) => void;
  extraOne?: (input: string) => void;
  iTwoType?: InputType;
  iTwoPlace?: string;
  iTwo?: string;
  setITwo?: (input: string) => void;
  isPending?: boolean;
};

export const FormBox = ({
  onSubmit,
  iOneType,
  iOnePLace,
  iOne,
  setIOne,
  extraOne,
  iTwoType,
  isPending,
  iTwoPlace,
  iTwo,
  setITwo,
}: FormBoxProps) => {
  return (
    <form
      autoComplete="off"
      onSubmit={onSubmit}
      className={`flex ${iTwoType ? "flex-col" : ""} gap-2`}
    >
      <fieldset name={iOne} className="flex items-center gap-2">
        <label htmlFor="member">Name</label>
        <input
          id={iOne}
          name={iOne}
          placeholder={iOnePLace}
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
          <fieldset name={iTwo} className="flex items-center gap-2">
            <label htmlFor={iTwo} className="pe-1">
              Email
            </label>
            <input
              id={iTwo}
              name={iTwo}
              placeholder={iTwoPlace}
              type={iTwoType}
              className="outline-none rounded bg-neutral-200 p-1"
              value={iTwo}
              onChange={(e) => setITwo?.(e.target.value)}
            />
          </fieldset>
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
