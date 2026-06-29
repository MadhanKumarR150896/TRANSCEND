import { useState, type SyntheticEvent } from "react";
import { PanelLayout } from "../components/PanelLayout";
import { useQuery } from "@tanstack/react-query";
import { useCreateMember, useGetMembers } from "../services/memberService";

export const MemberPanel = () => {
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [create, setCreate] = useState(false);
  const { data: members, isLoading } = useQuery(useGetMembers());
  const { mutate, isPending } = useCreateMember();

  const createMember = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!memberName.trim() || !memberEmail) return;

    mutate(
      { name: memberName, email: memberEmail },
      {
        onSuccess: () => {
          setMemberName("");
          setMemberEmail("");
          setCreate(false);
        },
        onError: () => {
          setMemberEmail("");
        },
      }
    );
  };

  return (
    <PanelLayout
      title="Member"
      isCreate={create}
      isSetCreate={setCreate}
      isIsLoading={isLoading}
      loadingMessage="Members are loading..."
      formElement={
        <form onSubmit={createMember} className=" flex flex-wrap gap-2">
          <fieldset name="member" className="flex items-center gap-2">
            <label htmlFor="member">Name</label>
            <input
              id="member"
              name="member"
              placeholder="Member Name"
              type="text"
              className="outline-none rounded bg-neutral-200 p-1"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
            />
          </fieldset>
          <fieldset name="email" className="flex items-center gap-2">
            <label htmlFor="email" className="pe-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              placeholder="Email"
              type="email"
              className="outline-none rounded bg-neutral-200 p-1"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
            />
          </fieldset>
          <button
            className="bg-neutral-200 py-1 px-2 rounded hover:cursor-pointer"
            type="submit"
          >
            {isPending ? "Creating" : "Submit"}
          </button>
        </form>
      }
    >
      {members?.map((member) => (
        <div
          key={member.id}
          className="bg-neutral-600 text-white text-sm font-bold rounded px-2 py-1"
        >
          <span>{member.name}</span>
        </div>
      ))}
    </PanelLayout>
  );
};
