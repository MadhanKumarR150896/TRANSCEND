import { useRef, useState, type SyntheticEvent } from "react";
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
  const formRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const createMember = (e: SyntheticEvent<HTMLFormElement, Event>) => {
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
          setMemberName("");
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
      buttonRef={buttonRef}
      isSetCreate={setCreate}
      isIsLoading={isLoading}
      loadingMessage="Members are loading..."
      formElement={
        <div className="flex-1" ref={formRef}>
          <FormBox
            formRef={formRef}
            buttonRef={buttonRef}
            onSubmit={createMember}
            iOneType="text"
            iOneName="membername"
            iOnePlace="Member Name"
            iOne={memberName}
            setIOne={setMemberName}
            iTwoType="email"
            iTwoName="memberemail"
            iTwoPlace="Member Email"
            iTwo={memberEmail}
            setITwo={setMemberEmail}
            isPending={isPending}
            onClose={() => {
              setCreate(false);
              setMemberName("");
              setMemberEmail("");
            }}
          />
        </div>
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
