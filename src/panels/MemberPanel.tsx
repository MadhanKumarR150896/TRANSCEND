import { useState, type SyntheticEvent } from "react";
import { PanelLayout } from "../components/PanelLayout";
import { useQuery } from "@tanstack/react-query";
import { useCreateMember, useGetMembers } from "../services/memberService";
import { FormBox } from "../components/FormBox";

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
        },
        onError: () => {
          setMemberEmail("");
        },
      }
    );
  };

  return (
    <PanelLayout
      title="Members"
      variant="Create Member"
      isCreate={create}
      isSetCreate={setCreate}
      isIsLoading={isLoading}
      loadingMessage="Members are loading..."
      formElement={
        <FormBox
          onSubmit={createMember}
          iOneType="text"
          iOnePLace="Member Name"
          iOne={memberName}
          setIOne={setMemberName}
          iTwoType="email"
          iTwoPlace="Member Email"
          iTwo={memberEmail}
          setITwo={setMemberEmail}
          isPending={isPending}
        />
      }
    >
      {members?.map((member) => (
        <div
          key={member.id}
          className="bg-neutral-600 text-white font-bold rounded px-2 py-1"
        >
          <span>{member.name}</span>
        </div>
      ))}
    </PanelLayout>
  );
};
